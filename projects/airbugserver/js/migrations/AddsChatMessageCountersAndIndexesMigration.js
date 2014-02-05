//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsChatMessageCountersAndIndexesMigration')

//@Require('Class')
//@Require('airbugserver.ChatMessageCounterModel')
//@Require('airbugserver.ChatMessageModel')
//@Require('airbugserver.ConversationModel')
//@Require('airbugserver.Migration')
//@Require('bugflow.BugFlow')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require("mongoose");

//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ChatMessageCounterModel = bugpack.require("airbugserver.ChatMessageCounterModel");
var ChatMessageModel        = bugpack.require('airbugserver.ChatMessageModel');
var ConversationModel       = bugpack.require('airbugserver.ConversationModel');
var Migration               = bugpack.require('airbugserver.Migration');
var BugFlow                 = bugpack.require('bugflow.BugFlow');

var $forEachParallel        = BugFlow.$forEachParallel;
var $forEachSeries          = BugFlow.$forEachSeries;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $whileSeries            = BugFlow.$whileSeries;

//make sure there is an index on sentAt see AddsSentAtIndexToChatMessagesMigration.js
//find all chatmessagcounters
//find all conversations
//insert chatmessagecounters for those conversations that don't have counters
//for each conversation find the earliest message
//check message count against number of messages updated as a validation check
//go from the earliest message to the latest in small batches and update

var AddsChatMessageCountersAndIndexesMigration = Class.extend(Migration, {
    name: "AddsChatMessageCountersAndIndexesMigration",
    app: "airbug",
    appVersion: "0.0.13",
    version: "0.0.1",
    up: function(callback) {
        console.log("Running", this.getName(), "...");

        var _this = this;
        var conversations = null;

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
                    console.log("adding index numbers to chatMessages in conversation", conversation._id);
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
                                            console.log("chatMessageCounter saved:", chatMessageCounters);
                                            flow.complete(error);
                                        });
                                    } else {
                                        console.log("chatMessageCounter already exists");
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
                                console.log("message count for conversation", conversationId, ":", returnedCount);
                                messageCount = returnedCount;
                                flow.complete(error);
                            });
                        }),
                        $task(function(flow){
                            //if there are chatmessages for the conversation
                            //add index numbers to chatMessages
                            if(messageCount > 0) {
                                console.log("count is greater than 0");
                                $series([
                                    $task(function(flow){
                                        //limit 1 reduces the number of chatmessages kept in memory while doing the sort to 1
                                        console.log("retrieving earliest chatMessage for conversation", conversationId);
                                        ChatMessageModel.find({conversationId: conversationId}).sort({sentAt: 1}).limit(1).exec(function(error, chatMessages){
                                            if(!error){
                                                if(chatMessages[0]){
                                                    earliestChatMessage = chatMessages[0];
                                                    oldestSentAt        = earliestChatMessage.sentAt;
                                                    console.log("earliestChatMessage:", earliestChatMessage._id);
                                                    console.log("oldestSentAt:", oldestSentAt);
                                                    flow.complete();
                                                } else {
                                                    console.log("There are no chatMessages in this conversation");
                                                    flow.complete(); //There are no chatMessages in this conversation
                                                }
                                            }else{
                                                flow.complete(error);
                                            }
                                        });
                                    }),
                                    $task(function(flow){
                                        console.log("updating the earliest chatMessage");
                                        ChatMessageModel.getNextIndexByConversationId(conversationId, function(error, index){
                                            console.log("index:", index);
                                            if(!error){
                                                earliestChatMessage.index = index;
                                                earliestChatMessage.updatedAt = Date.now();
                                                earliestChatMessage.save(function(error, chatMessage, numberAffected){
                                                    if(!error){
                                                        if(numberAffected === 0){
                                                            flow.complete(new Error("earliestChatMessage did not save"));
                                                        } else {
                                                            console.log("earliest chatMessage saved:", chatMessage._id);
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
                                        console.log("conversationId:", conversationId, "oldestSentAt:", oldestSentAt);
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
                                                console.log("number of remaining chatMessages:", chatMessages.length);

                                                $whileSeries(
                                                    function(flow){
                                                        flow.assert(chatMessages.length > 0)},
                                                    $series([
                                                        $task(function(flow){
                                                            $forEachSeries(chatMessages, function(flow, chatMessage) {
                                                                console.log("retrieving index for chatMessage:", chatMessage._id);
                                                                ChatMessageModel.getNextIndexByConversationId(conversationId, function(error, index){
                                                                    console.log("index:", index);
                                                                    if(!error){
                                                                        chatMessage.index = index;
                                                                        chatMessage.updatedAt = Date.now();
                                                                        chatMessage.save(function(error, chatMessage, numberAffected){
                                                                            if(!error){
                                                                                if(numberAffected === 0){
                                                                                    flow.complete(new Error("ChatMessage did not save"));
                                                                                } else {
                                                                                    console.log("ChatMessage saved:", chatMessage);
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
                                                            console.log('lastSentAt:', lastSentAt);
                                                            flow.complete();
                                                        })
                                                        ,
                                                        $task(function(flow){
                                                            console.log("conversationId:", conversationId, "lastSentAt:", lastSentAt);
                                                            ChatMessageModel
                                                            .find({
                                                                conversationId: conversationId,
                                                                sentAt: {$gt: lastSentAt}
                                                            })
                                                            .sort({sentAt: 1})
                                                            .limit(500)
                                                            .exec(function(error, returnedChatMessages) {
                                                                console.log("error:", error);
                                                                console.log("returnedChatMessages", returnedChatMessages);
                                                                if(!error) {
                                                                    chatMessages = returnedChatMessages;
                                                                    console.log("chatMessages reset with next set of messages");
                                                                    flow.complete();
                                                                } else {
                                                                    console.log("chatMessages reset. no more messages in this conversation");
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
                                        console.log("counter is", counter);
                                        console.log("messageCount is", messageCount);
                                        if(counter != messageCount){
                                            console.log("Error: internal count does not equal message count");
                                        }
                                        flow.complete(error);
                                    });
                            } else {
                                console.log("messageCount is", messageCount);
                                console.log("counter is", counter);
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
        .execute(function(error){
            if(error) {
                console.log("Error:", error);
                console.log("Up migration", _this.name, "failed.");
                callback(error);
            } else {
                console.log("Up migration", _this.name, "completed.");
                console.log("Currently at migration version", _this.version, "for", _this.app, _this.appVersion);
                callback();
            }
        });
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsChatMessageCountersAndIndexesMigration', AddsChatMessageCountersAndIndexesMigration);
