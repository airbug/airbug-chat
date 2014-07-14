/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageManager')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('List')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.ChatMessage')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('Flows')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                         = bugpack.require('Bug');
    var Class                       = bugpack.require('Class');
    var List                        = bugpack.require('List');
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var ChatMessage                 = bugpack.require('airbugserver.ChatMessage');
    var EntityManager               = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag     = bugpack.require('bugentity.EntityManagerTag');
    var Flows                     = bugpack.require('Flows');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var entityManager               = EntityManagerTag.entityManager;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var ChatMessageManager = Class.extend(EntityManager, {

        _name: "airbugserver.ChatMessageManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {EntityManagerStore} entityManagerStore
         * @param {SchemaManager} schemaManager
         * @param {EntityDeltaBuilder} entityDeltaBuilder
         * @param {ChatMessageCounterManager} chatMessageCounterManager
         */
        _constructor: function(entityManagerStore, schemaManager, entityDeltaBuilder, chatMessageCounterManager) {

            this._super(entityManagerStore, schemaManager, entityDeltaBuilder);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageCounterManager}
             */
            this.chatMessageCounterManager = chatMessageCounterManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ChatMessageCounterManager}
         */
        getChatMessageCounterManager: function() {
            return this.chatMessageCounterManager;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ChatMessage} chatMessage
         * @param {(Array.<string> | function(Throwable, ChatMessage=))} dependencies
         * @param {function(Throwable, ChatMessage=)=} callback
         */
        createChatMessage: function(chatMessage, dependencies, callback) {
            var _this = this;
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            var index           = null;
            $series([
                $task(function(flow) {
                    _this.chatMessageCounterManager.getNextIndexByConversationId(chatMessage.getConversationId(), function(throwable, returnedIndex) {
                        if (!throwable) {
                            if (returnedIndex) {
                                index = returnedIndex;
                                flow.complete();
                            } else {
                                flow.error(new Bug("Error", {}, "Next index for chatMessage could not be retrieved"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    chatMessage.setIndex(index);
                    _this.create(chatMessage, options, dependencies, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, chatMessage);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {ChatMessage} chatMessage
         * @param {function(Throwable)} callback
         */
        deleteChatMessage: function(chatMessage, callback) {
            this.delete(chatMessage, callback);
        },

        /**
         * @param {{
         *      body: string,
         *      conversationId: string,
         *      conversationOwnerId: string,
         *      createdAt: Date,
         *      senderUserId: string,
         *      sentAt: Date,
         *      tryUuid: string,
         *      type: string,
         *      updatedAt: Date
         * }} data
         * @return {ChatMessage}
         */
        generateChatMessage: function(data) {
            var chatMessage = new ChatMessage(data);
            this.generate(chatMessage);
            return chatMessage;
        },

        /**
         * @param {ChatMessage} chatMessage
         * @param {Array.<string>} properties
         * @param {function(Throwable, ChatMessage)} callback
         */
        populateChatMessage: function(chatMessage, properties, callback) {
            var options = {
                conversation: {
                    idGetter:   chatMessage.getConversationId,
                    getter:     chatMessage.getConversation,
                    setter:     chatMessage.setConversation
                },
                senderUser: {
                    idGetter:   chatMessage.getSenderUserId,
                    getter:     chatMessage.getSenderUser,
                    setter:     chatMessage.setSenderUser
                }
            };
            this.populate(chatMessage, options, properties, callback);
        },

        /**
         * @param {string} chatMessageId
         * @param {function(Throwable, ChatMessage)} callback
         */
        retrieveChatMessage: function(chatMessageId, callback) {
            this.retrieve(chatMessageId, callback);
        },

        /**
         * @param {Array.<string>} chatMessageIds
         * @param {function(Throwable, Map.<string, ChatMessage>)} callback
         */
        retrieveChatMessages: function(chatMessageIds, callback) {
            this.retrieveEach(chatMessageIds, callback);
        },

        /**
         * @param {string} senderUserId
         * @param {string} conversationId
         * @param {string} tryUuid
         * @param {function(Throwable, ChatMessage=)} callback
         */
        retrieveChatMessageBySenderUserIdAndConversationIdAndTryUuid: function(senderUserId, conversationId, tryUuid, callback) {
            var _this = this;
            this.getDataStore()
                .where("senderUserId", senderUserId)
                .where("conversationId", conversationId)
                .where("tryUuid", tryUuid)
                .lean(true)
                .exec(function(throwable, dbObject) {
                    if (!throwable) {
                        var entityObject = null;
                        if (dbObject) {
                            if(!TypeUtil.isArray(dbObject) || dbObject.length > 0){
                                entityObject = _this.convertDbObjectToEntity(dbObject);
                                entityObject.commitDelta();
                            }
                        }
                        callback(null, entityObject);
                    } else {
                        callback(throwable);
                    }
                });
        },

        /**
         * @param {string} conversationId
         * @param {number} index
         * @param {number} batchSize
         * @param {string | number} order
         * @param {function(Throwable, List.<ChatMessage>=)} callback
         */
        retrieveChatMessageBatchByConversationId: function(conversationId, index, batchSize, order, callback) {
            var _this = this;
            //validate arguments
            if(['asc', 'desc', 'ascending', 'descending', 1, -1].indexOf(order) === -1){
                callback(new Throwable("Incorrect Type", {}, "order must be one of the following 'asc', 'desc', 'ascending', 'descending', 1, or -1"));
            } else if (!TypeUtil.isNumber(batchSize)) {
                callback(new Throwable("Incorrect Type", {}, "batchSize must be a number. Max size is 100"));
            } else if (!TypeUtil.isNumber(index)) {
                callback(new Throwable("Incorrect Type", {}, "index must be a number. Use -1 for the last index"));
            } else {

                var query   = this.dataStore.where("conversationId", conversationId);
                var newList = new List();

                $series([
                    $task(function(flow){
                        _this.updateQueryConditionForIndex(query, conversationId, index, batchSize, function(throwable, updatedQuery){
                            query = updatedQuery;
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow){
                        query.lean(true).sort({sentAt: order}).exec(function(throwable, dbObjects){
                            if (!throwable) {
                                dbObjects.forEach(function(dbObject) {
                                    var chatMessage = _this.convertDbObjectToEntity(dbObject);
                                    chatMessage.commitDelta();
                                    newList.add(chatMessage);
                                });
                            }
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable){
                    callback(throwable, newList);
                });
            }
        },

    //    addIndexToConditionUsingIndexAndBatchSize: function(condition, index, batchSize) {
    //        index -1, batch 50 => {$gte: count - 50 or 0, $lt: count}
    //        index 0 , batch 50 => {$gte: 0, $lt: 0}
    //        index 10, batch 50 => {$gte: 0, $lt: 10}
    //        index 55, batch 50 => {$gte: 5, $lt: 55}
    //    },
        updateQueryConditionForIndex: function(query, conversationId, index, batchSize, callback) {
            var count = undefined;

            //Limit batchSize to a max of 100.
            batchSize > 100 ? 100 : batchSize;

            if(index < 0) {
                this.chatMessageCounterManager.retrieveChatMessageCounterByConversationId(conversationId, function(throwable, chatMessageCounter) {
                    if(chatMessageCounter) {
                        count = chatMessageCounter.getCount();
                        if(count <= batchSize) {
                            query = query.where("index").gte(0);
                        } else {
                            query = query.where("index").gte(count + 1 - batchSize);
                        }
                    }
                    //if no chatMessageCounter is returned, do not add to query => this will cause the system to return all chatMessages limit 1000
                    //TODO SUNG figure out a better way to deal with this edge case.
                    //Should we assume the count is 0?
                    callback(throwable, query);
                });
            } else if(index <= batchSize) {
                query = query.where("index").gte(0).lt(index);
                callback(undefined, query);
            } else {
                query = query.where("index").gte(index - batchSize).lt(index);
                callback(undefined, query);
            }
        },

        /**
         * @param {string} conversationId
         * @param {function(Throwable, Set.<ChatMessage>=)} callback
         */
        retrieveChatMessagesByConversationId: function(conversationId, callback) {
            var _this = this;
            this.getDataStore().find({conversationId: conversationId}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newSet = new Set();
                    dbObjects.forEach(function(dbObject) {
                        var chatMessage = _this.convertDbObjectToEntity(dbObject);
                        chatMessage.commitDelta();
                        newSet.add(chatMessage);
                    });
                    callback(null, newSet);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} conversationId
         * @param {function(Throwable, List.<ChatMessage>=)} callback
         */
        retrieveChatMessagesByConversationIdSortBySentAt: function(conversationId, callback) {
            var _this = this;
            this.dataStore.find({conversationId: conversationId}).sort({sentAt: 1}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = new List();
                    dbObjects.forEach(function(dbObject) {
                        var chatMessage = _this.convertDbObjectToEntity(dbObject);
                        chatMessage.commitDelta();
                        newList.add(chatMessage);
                    });
                    callback(null, newList);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {ChatMessage} chatMessage
         * @param {function(Throwable, ChatMessage)} callback
         */
        updateChatMessage: function(chatMessage, callback) {
            this.update(chatMessage, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageManager).with(
        entityManager("chatMessageManager")
            .ofType("ChatMessage")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder"),
                arg().ref("chatMessageCounterManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
});
