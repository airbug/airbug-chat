//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsChatMessageCountersAndIndexesMigration')
//@Autoload

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Migration                       = bugpack.require('bugmigrate.Migration');
var MigrationAnnotation             = bugpack.require('bugmigrate.MigrationAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var migration                       = MigrationAnnotation.migration;
var property                        = PropertyAnnotation.property;
var $forEachParallel                = BugFlow.$forEachParallel;
var $forEachSeries                  = BugFlow.$forEachSeries;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;
var $whileSeries                    = BugFlow.$whileSeries;

//make sure there is an index on sentAt see AddsSentAtIndexToChatMessagesMigration.js
//find all chatmessagcounters
//find all conversations
//insert chatmessagecounters for those conversations that don't have counters
//for each conversation find the earliest message
//check message count against number of messages updated as a validation check
//go from the earliest message to the latest in small batches and update

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddsChatMessageCountersAndIndexesMigration = Class.extend(Migration, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} appName
     * @param {string} appVersion
     * @param {string} name
     * @param {string} version
     */
    _constructor: function(appName, appVersion, name, version) {

        this._super(appName, appVersion, name, version);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                 = null;
        
        /**
         * @private
         * @type {MongoDataStore}
         */
        this.mongoDataStore         = null
    },

    
    //-------------------------------------------------------------------------------
    // Migration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    up: function(callback) {
        var _this                   = this;
        var ChatMessageCounterModel = this.mongoDataStore.getMongooseModelForName("ChatMessageCounter");
        var ChatMessageModel        = this.mongoDataStore.getMongooseModelForName("ChatMessage");
        var ConversationModel       = this.mongoDataStore.getMongooseModelForName("Conversation");
        var conversations           = null;

        this.logger.info("Running", this.getName(), "...");
        $series([
            $task(function(flow){
                //find all conversations
                ConversationModel.find({}, function(error, returnedConversations){
                    conversations = returnedConversations;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                $forEachSeries(conversations, function(flow, conversation){
                    _this.logger.info("adding index numbers to chatMessages in conversation", conversation._id);
                    var counter             = 0;
                    var conversationId      = conversation._id;
                    var earliestChatMessage = null;
                    var messageCount        = null;
                    var oldestSentAt        = null;
                    var lastSentAt          = null;
                    var chatMessages        = null;

                    $series([
                        $task(function(flow){
                            //create chatMessageCounters if they do not exist
                            ChatMessageCounterModel.find({conversationId: conversationId}, function(error, chatMessageCounters){
                                if(!error){
                                    if(chatMessageCounters.length === 0){
                                        var chatMessageCounter = new ChatMessageCounterModel({conversationId: conversationId});
                                        chatMessageCounter.save(function(error, chatMessageCounters, numberAffected){
                                            _this.logger.info("chatMessageCounter saved:", chatMessageCounters);
                                            flow.complete(error);
                                        });
                                    } else {
                                        _this.logger.info("chatMessageCounter already exists");
                                        flow.complete();
                                    }
                                } else {
                                    flow.complete(error);
                                }
                            });
                        }),
                        $task(function(flow){
                            //Get chatmessage count for conversation
                            ChatMessageModel.count({conversationId: conversationId}, function(error, returnedCount){
                                _this.logger.info("message count for conversation", conversationId, ":", returnedCount);
                                messageCount = returnedCount;
                                flow.complete(error);
                            });
                        }),
                        $task(function(flow){
                            //if there are chatmessages for the conversation
                            //add index numbers to chatMessages
                            if(messageCount > 0) {
                                _this.logger.info("count is greater than 0");
                                $series([
                                    $task(function(flow){
                                        //limit 1 reduces the number of chatmessages kept in memory while doing the sort to 1
                                        _this.logger.info("retrieving earliest chatMessage for conversation", conversationId);
                                        ChatMessageModel.find({conversationId: conversationId}).sort({sentAt: 1}).limit(1).exec(function(error, chatMessages){
                                            if(!error){
                                                if(chatMessages[0]){
                                                    earliestChatMessage = chatMessages[0];
                                                    oldestSentAt        = earliestChatMessage.sentAt;
                                                    _this.logger.info("earliestChatMessage:", earliestChatMessage._id);
                                                    _this.logger.info("oldestSentAt:", oldestSentAt);
                                                    flow.complete();
                                                } else {
                                                    _this.logger.info("There are no chatMessages in this conversation");
                                                    flow.complete(); //There are no chatMessages in this conversation
                                                }
                                            }else{
                                                flow.complete(error);
                                            }
                                        });
                                    }),
                                    $task(function(flow){
                                        _this.logger.info("updating the earliest chatMessage");
                                        ChatMessageModel.getNextIndexByConversationId(conversationId, function(error, index){
                                            _this.logger.info("index:", index);
                                            if(!error){
                                                earliestChatMessage.index = index;
                                                earliestChatMessage.updatedAt = Date.now();
                                                earliestChatMessage.save(function(error, chatMessage, numberAffected){
                                                    if(!error){
                                                        if(numberAffected === 0){
                                                            flow.complete(new Error("earliestChatMessage did not save"));
                                                        } else {
                                                            _this.logger.info("earliest chatMessage saved:", chatMessage._id);
                                                            counter = counter + 1;
                                                            flow.complete();
                                                        }
                                                    } else {
                                                        flow.complete(error);
                                                    }
                                                });
                                            } else {
                                                flow.complete(error);
                                            }
                                        });
                                    }),
                                    $task(function(flow){
                                        //Find the next 100 messages for that conversation in ascending order of SentAt
                                        _this.logger.info("conversationId:", conversationId, "oldestSentAt:", oldestSentAt);
                                        ChatMessageModel
                                        .find({
                                            conversationId: conversationId,
                                            sentAt: {$gt: oldestSentAt}
                                        })
                                        .sort({sentAt: 1})
                                        .limit(500)
                                        .exec(function(error, returnedChatMessages){
                                            if(!error){
                                                chatMessages = returnedChatMessages;
                                                _this.logger.info("number of remaining chatMessages:", chatMessages.length);

                                                $whileSeries(
                                                    function(flow){
                                                        flow.assert(chatMessages.length > 0)},
                                                    $series([
                                                        $task(function(flow){
                                                            $forEachSeries(chatMessages, function(flow, chatMessage) {
                                                                _this.logger.info("retrieving index for chatMessage:", chatMessage._id);
                                                                ChatMessageModel.getNextIndexByConversationId(conversationId, function(error, index){
                                                                    _this.logger.info("index:", index);
                                                                    if(!error){
                                                                        chatMessage.index = index;
                                                                        chatMessage.updatedAt = Date.now();
                                                                        chatMessage.save(function(error, chatMessage, numberAffected){
                                                                            if(!error){
                                                                                if(numberAffected === 0){
                                                                                    flow.complete(new Error("ChatMessage did not save"));
                                                                                } else {
                                                                                    _this.logger.info("ChatMessage saved:", chatMessage);
                                                                                    counter = counter + 1;
                                                                                    flow.complete();
                                                                                }
                                                                            } else {
                                                                                flow.complete(error);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        flow.complete(error);
                                                                    }
                                                                });
                                                            })
                                                            .execute(function(error){
                                                                flow.complete(error);
                                                            })
                                                        }),
                                                        $task(function(flow){
                                                            lastSentAt = chatMessages[chatMessages.length - 1].sentAt;
                                                            _this.logger.info('lastSentAt:', lastSentAt);
                                                            flow.complete();
                                                        })
                                                        ,
                                                        $task(function(flow){
                                                            _this.logger.info("conversationId:", conversationId, "lastSentAt:", lastSentAt);
                                                            ChatMessageModel
                                                            .find({
                                                                conversationId: conversationId,
                                                                sentAt: {$gt: lastSentAt}
                                                            })
                                                            .sort({sentAt: 1})
                                                            .limit(500)
                                                            .exec(function(error, returnedChatMessages) {
                                                                _this.logger.info("error:", error);
                                                                _this.logger.info("returnedChatMessages", returnedChatMessages);
                                                                if(!error) {
                                                                    chatMessages = returnedChatMessages;
                                                                    _this.logger.info("chatMessages reset with next set of messages");
                                                                    flow.complete();
                                                                } else {
                                                                    _this.logger.info("chatMessages reset. no more messages in this conversation");
                                                                    chatMessages = [];
                                                                    flow.complete(error);
                                                                }
                                                            })
                                                        })
                                                    ])
                                                )
                                                .execute(function(error){
                                                    flow.complete(error);

                                                })
                                            } else {
                                                flow.complete(error);
                                            }
                                        });
                                    })
                                ])
                                    .execute(function(error){
                                        _this.logger.info("counter is", counter);
                                        _this.logger.info("messageCount is", messageCount);
                                        if(counter != messageCount){
                                            _this.logger.info("Error: internal count does not equal message count");
                                        }
                                        flow.complete(error);
                                    });
                            } else {
                                _this.logger.info("messageCount is", messageCount);
                                _this.logger.info("counter is", counter);
                                flow.complete();
                            }
                        })
                    ])
                        .execute(function(error){
                            flow.complete(error);
                        });
                })
                    .execute(function(error){
                        flow.complete(error);
                    })
            })
        ])
        .execute(callback);
    }

//    ,down: function(callback) {
//        $series([
//            $task(function(flow){
//                ChatMessageCounterModel.remove({}, function(error){
//                    flow.complete(error);
//                });
//            }),
//            $task(function(flow){
//                ChatMessageModel.find({}, function(error, chatMessages){
//                    //delete index from all chatmessages
//                    //update updatedAt
//                    if(!error){
//                        $forEachParallel(chatMessages, function(flow, chatMessage){
//                            chatMessage.index = undefined
//                            chatMessage.updatedAt = Date.now();
//                            chatMessage.save(function(error, chatMessage, numberAffected){
//                                if(!error) {
//                                    if(numberAffected === 0){
//                                        flow.complete(new Error("chatMessage was not saved"));
//                                    } else {
//                                        flow.complete();
//                                    }
//                                } else {
//                                    flow.complete(error);
//                                }
//                            });
//                        }).execute(function(error){
//                                flow.complete(error);
//                            });
//                    } else {
//                        flow.complete(error);
//                    }
//                });
//            })
//        ])
//        .execute(function(error){
//                callback(error);
//        });
//    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AddsChatMessageCountersAndIndexesMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.13")
        .name("AddsChatMessageCountersAndIndexesMigration")
        .version("0.0.1"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsChatMessageCountersAndIndexesMigration', AddsChatMessageCountersAndIndexesMigration);
