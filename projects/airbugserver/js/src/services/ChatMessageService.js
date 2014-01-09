//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Map                     = bugpack.require('Map');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var EntityService           = bugpack.require('airbugserver.EntityService');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $iterableParallel       = BugFlow.$iterableParallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityService}
 */
var ChatMessageService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageManager, conversationManager, chatMessageStreamManager, chatMessagePusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.chatMessageManager             = chatMessageManager;

        /**
         * @private
         * @type {ChatMessagePusher}
         */
        this.chatMessagePusher              = chatMessagePusher;

        /**
         * @private
         * @type {ChatMessageStreamManager}
         */
        this.chatMessageStreamManager       = chatMessageStreamManager;

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager            = conversationManager;
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
        var _this = this;
        var chatMessage     = this.chatMessageManager.generateChatMessage(chatMessageObject);
        var callManager     = requestContext.get("callManager");
        var currentUser     = requestContext.get("currentUser");

        if (currentUser.isNotAnonymous() && currentUser.getId() === chatMessage.getSenderUserId()) {

            var conversation = null;
            $series([
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(chatMessage.getConversationId(), function(throwable, returnedConversation) {
                        if (!throwable) {

                            //NOTE BRN: Validate that the user is a member of this room

                            if (currentUser.getRoomIdSet().contains(returnedConversation.getOwnerId())) {
                                conversation = returnedConversation;
                                flow.complete();
                            } else {
                                flow.error(new Exception("UnauthorizedAccess"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {

                    //NOTE BRN: Make sure that this chat message does not already exist (in the case of retry or a message sent twice)

                    _this.chatMessageManager.retrieveChatMessageBySenderUserIdAndConversationIdAndTryUuid(chatMessage.getSenderUserId(),
                        chatMessage.getConversationId(), chatMessage.getTryUuid(), function(throwable, chatMessage) {
                        if (!throwable) {
                            if (chatMessage) {
                                flow.error(new Exception("ChatMessage already exists"));
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
                    _this.chatMessagePusher.meldCallWithChatMessage(callManager.getCallUuid(), chatMessage, function(throwable) {
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
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageId
     * @param {function(Throwable} callback
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
        var callManager         = requestContext.get("callManager");
        /** @type {ChatMessage} */
        var chatMessage         = null;
        var chatMessageManager  = this.chatMessageManager;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow){
                    chatMessageManager.retrieveChatMessage(chatMessageId, function(throwable, returnedChatMessage){
                        chatMessage = returnedChatMessage;
                        if (!throwable) {
                            if (!chatMessage) {
                                flow.error(new Exception("NotFound"));
                            } else {
                                flow.complete();
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessage(callManager.getCallUuid(), chatMessage, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessageToCall(chatMessage, callManager.getCallUuid(), function(throwable) {
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
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageIds
     * @param {function(Throwable, Map.<string, ChatMessage>} callback
     */
    retrieveChatMessages: function(requestContext, chatMessageIds, callback) {
        var _this               = this;
        /** @type {Map.<string, ChatMessage>} */
        var chatMessageMap      = null;
        var currentUser         = requestContext.get("currentUser");
        var callManager         = requestContext.get("callManager");
        var chatMessageManager  = this.chatMessageManager;
        var mappedException     = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    chatMessageManager.retrieveChatMessages(chatMessageIds, function(throwable, returnedChatMessageMap) {
                        if (!throwable) {
                            if (!returnedChatMessageMap) {
                                throwable = new Exception(""); //TODO
                            } else {
                                chatMessageMap = returnedChatMessageMap.clone();
                                returnedChatMessageMap.forEach(function(chatMessage, key) {
                                    if (chatMessage === null) {
                                        chatMessageMap.remove(key);
                                        if (!mappedException) {
                                            mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                        }
                                        mappedException.putThrowable(key, new Exception("NotFound", {objectId: key}));
                                    }
                                });
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessages(callManager.getCallUuid(), chatMessageMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessagesToCall(chatMessageMap.getValueArray(), callManager.getCallUuid(), function(throwable) {
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
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} conversationId
     * @param {function(Throwable, Map.<string, ChatMessage>=)} callback
     */
    retrieveChatMessagesByConversationId: function(requestContext, conversationId, callback) {
        var _this = this;
        var currentUser     = requestContext.get("currentUser");
        var callManager     = requestContext.get("callManager");
        if (currentUser.isNotAnonymous()) {

            var chatMessageMap  = null;
            var conversation    = null;
            var mappedException = null;

            $series([
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(conversationId, function(throwable, returnedConversation) {
                        if (!throwable) {

                            //NOTE BRN: Validate that the user is a member of this room

                            if (currentUser.getRoomIdSet().contains(returnedConversation.getOwnerId())) {
                                conversation = returnedConversation;
                                flow.complete();
                            } else {
                                flow.error(new Exception("UnauthorizedAccess"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.chatMessageManager.retrieveChatMessagesByConversationId(conversation.getId(), function(throwable, returnedChatMessageSet) {
                        if (!throwable) {
                            chatMessageMap = new Map();
                            returnedChatMessageSet.forEach(function(chatMessage) {
                                chatMessageMap.put(chatMessage.getId(), chatMessage);
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.meldCallWithChatMessages(callManager.getCallUuid(), chatMessageMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessagePusher.pushChatMessagesToCall(chatMessageMap.getValueArray(), callManager.getCallUuid(), function(throwable) {
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
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageId
     * @param {{*}} updates
     * @param {function(Throwable, ChatMessage} callback
     */
    updateChatMessage: function(requestContext, chatMessageId, updates, callback) {
        //TODO BRN: Implement
        callback(new Exception("UnauthorizedAccess"));
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageService).with(
    module("chatMessageService")
        .args([
            arg().ref("chatMessageManager"),
            arg().ref("conversationManager"),
            arg().ref("chatMessageStreamManager"),
            arg().ref("chatMessagePusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
