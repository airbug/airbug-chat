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

//@Export('airbugserver.ChatMessageService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Map                 = bugpack.require('Map');
    var MappedThrowable     = bugpack.require('MappedThrowable');
    var Obj                 = bugpack.require('Obj');
    var EntityService       = bugpack.require('airbugserver.EntityService');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var property            = PropertyTag.property;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityService}
     */
    var ChatMessageService = Class.extend(EntityService, {

        _name: "airbugserver.ChatMessageService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageManager}
             */
            this.chatMessageManager             = null;

            /**
             * @private
             * @type {ChatMessagePusher}
             */
            this.chatMessagePusher              = null;

            /**
             * @private
             * @type {ChatMessageStreamManager}
             */
            this.chatMessageStreamManager       = null;

            /**
             * @private
             * @type {ConversationManager}
             */
            this.conversationManager            = null;

            /**
             * @private
             * @type {ConversationSecurity}
             */
            this.conversationSecurity           = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {{
         *      conversationId: ObjectId
         *      senderUserId: ObjectId
         *      body: string
         * }} chatMessageObject
         * @param {function(Throwable, ChatMessage=)} callback
         */
        createChatMessage: function(requestContext, chatMessageObject, callback) {
            var _this           = this;
            var chatMessage     = this.chatMessageManager.generateChatMessage(chatMessageObject);
            var call            = requestContext.get("call");
            var currentUser     = requestContext.get("currentUser");

            if (currentUser.getId() === chatMessage.getSenderUserId()) {
                if (chatMessage.getConversationId()) {
                    var conversation = null;
                    $series([
                        $task(function(flow) {
                            _this.conversationManager.retrieveConversation(chatMessage.getConversationId(), function(throwable, returnedConversation) {
                                if (!throwable) {
                                    conversation = returnedConversation;
                                    flow.complete(throwable);
                                } else {
                                    flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + chatMessage.getConversationId() + "'"))
                                }
                            });
                        }),
                        $task(function(flow) {
                            _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.conversationSecurity.checkConversationWriteAccess(currentUser, conversation, function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {

                            //NOTE BRN: Make sure that this chat message does not already exist (in the case of retry or a message sent twice)

                            _this.chatMessageManager.retrieveChatMessageBySenderUserIdAndConversationIdAndTryUuid(chatMessage.getSenderUserId(),
                                chatMessage.getConversationId(), chatMessage.getTryUuid(), function(throwable, chatMessage) {
                                if (!throwable) {
                                    if (chatMessage) {
                                        flow.error(new Exception("AlreadyExists", {}, "ChatMessage already exists"));
                                    } else {
                                        flow.complete();
                                    }
                                } else {
                                    flow.error(throwable);
                                }
                            });
                        }),
                        $task(function(flow) {
                            _this.chatMessageManager.createChatMessage(chatMessage, function(throwable, chatMessage) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.chatMessagePusher.meldCallWithChatMessage(call.getCallUuid(), chatMessage, function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.chatMessagePusher.pushChatMessage(chatMessage, [call.getCallUuid()], function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            var chatMessageStream = _this.chatMessageStreamManager.generateChatMessageStream({
                                id: conversation.getId()
                            });
                            _this.chatMessagePusher.streamChatMessage(chatMessageStream, chatMessage, function(throwable) {
                                flow.complete(throwable);
                            });
                        })
                    ]).execute(function(throwable) {
                        callback(throwable, chatMessage);
                    });
                } else {
                    callback(new Exception("BadRequest", {}, "Request missing conversation id"));
                }
            } else {
                callback(new Exception("UnauthorizedAccess", {}, "Messages can only be created by the current user"));
            }
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} chatMessageId
         * @param {function(Throwable, Entity=} callback
         */
        deleteChatMessage: function(requestContext, chatMessageId, callback) {
            //TODO BRN: Implement
            callback(new Exception("UnauthorizedAccess"));
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} chatMessageId
         * @param {function(Throwable, ChatMessage=} callback
         */
        retrieveChatMessage: function(requestContext, chatMessageId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            /** @type {ChatMessage} */
            var chatMessage         = null;
            var chatMessageManager  = this.chatMessageManager;
            var conversation        = null;

            $series([
                $task(function(flow){
                    chatMessageManager.retrieveChatMessage(chatMessageId, function(throwable, returnedChatMessage) {
                        if (!throwable) {
                            if (!returnedChatMessage) {
                                flow.error(new Exception("NotFound", {}, "Could not find ChatMessage with the id '" + chatMessageId + "'"));
                            } else {
                                chatMessage = returnedChatMessage;
                                flow.complete();
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(chatMessage.getConversationId(), function(throwable, returnedConversation) {
                        if (!throwable) {
                            conversation = returnedConversation;
                            flow.complete(throwable);
                        } else {
                            flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + chatMessage.getConversationId() + "'"))
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessage(call.getCallUuid(), chatMessage, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessageToCall(chatMessage, call.getCallUuid(), function(throwable) {
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
         * @param {RequestContext} requestContext
         * @param {string} conversationId
         * @param {number} index
         * @param {number} batchSize
         * @param {string | number} order
         * @param {function(Throwable, List.<string, ChatMessage>=)} callback
         */
        retrieveChatMessageBatchByConversationId: function(requestContext, conversationId, index, batchSize, order, callback) {
            console.log("ChatMessageService#retrieveChatMessageBatchByConversationId");
            console.log("conversationId:", conversationId, "index:", index, "batchSize:", batchSize, "order", order);

            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var chatMessageList     = null;
            var conversation        = null;
            var mappedException     = null;

            $series([
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(conversationId, function(throwable, returnedConversation) {
                        if (!throwable) {
                            conversation = returnedConversation;
                            flow.complete(throwable);
                        } else {
                            flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + conversationId + "'"))
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessageManager.retrieveChatMessageBatchByConversationId(conversation.getId(), index, batchSize, order, function(throwable, returnedChatMessageList) {
                        if (!throwable) {
                            chatMessageList = returnedChatMessageList;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessages(call.getCallUuid(), chatMessageList.toArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessagesToCall(chatMessageList.toArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(mappedException, chatMessageList);
                } else {
                    callback(throwable);
                }
            });
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} chatMessageIds
         * @param {function(Throwable, Map.<string, ChatMessage>} callback
         */
        retrieveChatMessages: function(requestContext, chatMessageIds, callback) {

            //TODO BRN: Add security checks

            var _this               = this;
            /** @type {Map.<string, ChatMessage>} */
            var chatMessageMap      = null;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var chatMessageManager  = this.chatMessageManager;
            var mappedException     = null;

            if (currentUser.isNotAnonymous()) {
                $series([
                    $task(function(flow) {
                        chatMessageManager.retrieveChatMessages(chatMessageIds, function(throwable, returnedChatMessageMap) {
                            if (!throwable) {
                                if (!returnedChatMessageMap) {
                                    throwable = new Exception("NotFound", {chatMessageIds: chatMessageIds}, "Could not find ChatMessages with ids - '" + chatMessageIds + "'"); //TODO
                                } else {
                                    chatMessageMap = returnedChatMessageMap.clone();
                                    returnedChatMessageMap.forEach(function(chatMessage, key) {
                                        if (chatMessage === null) {
                                            chatMessageMap.remove(key);
                                            if (!mappedException) {
                                                mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                            }
                                            mappedException.putCause(key, new Exception("NotFound", {objectId: key}, "Could not find ChatMessage with the id '" + key + "'"));
                                        }
                                    });
                                }
                            }
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.chatMessagePusher.meldCallWithChatMessages(call.getCallUuid(), chatMessageMap.toValueArray(), function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.chatMessagePusher.pushChatMessagesToCall(chatMessageMap.toValueArray(), call.getCallUuid(), function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(mappedException, chatMessageMap);
                    } else {
                        callback(throwable);
                    }
                });
            } else {
                callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access chat messages"));
            }
        },

        /**
         * @param {RequestContext} requestContext
         * @param {string} conversationId
         * @param {function(Throwable, List.<string, ChatMessage>=)} callback
         */
        retrieveChatMessagesByConversationIdSortBySentAt: function(requestContext, conversationId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var chatMessageList     = null;
            var conversation        = null;
            var mappedException     = null;

            $series([
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(conversationId, function(throwable, returnedConversation) {
                        if (!throwable) {
                            conversation = returnedConversation;
                            flow.complete(throwable);
                        } else {
                            flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + conversationId + "'"))
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessageManager.retrieveChatMessagesByConversationIdSortBySentAt(conversation.getId(), function(throwable, returnedChatMessageList) {
                        if (!throwable) {
                            chatMessageList = returnedChatMessageList;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessages(call.getCallUuid(), chatMessageList.toArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessagesToCall(chatMessageList.toArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(mappedException, chatMessageList);
                } else {
                    callback(throwable);
                }
            });
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} chatMessageId
         * @param {{*}} updates
         * @param {function(Throwable, ChatMessage} callback
         */
        updateChatMessage: function(requestContext, chatMessageId, updates, callback) {
            //TODO BRN: Implement
            callback(new Exception("NotImplemented", {}, "Not implemented"));
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageService).with(
        module("chatMessageService")
            .properties([
                property("chatMessageManager").ref("chatMessageManager"),
                property("chatMessagePusher").ref("chatMessagePusher"),
                property("chatMessageStreamManager").ref("chatMessageStreamManager"),
                property("conversationManager").ref("conversationManager"),
                property("conversationSecurity").ref("conversationSecurity")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
});
