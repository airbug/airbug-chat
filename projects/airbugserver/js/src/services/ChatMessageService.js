//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageService')

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var MappedThrowable     = bugpack.require('MappedThrowable');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $task               = BugFlow.$task;
var $series             = BugFlow.$series;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageManager, conversationManager, meldService, conversationService, roomService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.chatMessageManager     = chatMessageManager;

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @private
         * @type {ConversationService}
         */
        this.conversationService    = conversationService;

        /**
         * @private
         * @type {MeldService}
         */
        this.meldService            = meldService;

        /**
         * @private
         * @type {RoomService}
         */
        this.roomService            = roomService;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      conversationId: ObjectId
     *      senderUserId: ObjectId
     *      body: string
     * }} chatMessageObject
     * @param {function(Throwable, ChatMessage)} callback
     */
    createChatMessage: function(requestContext, chatMessageObject, callback) {
        var _this = this;
        var chatMessage     = this.chatMessageManager.generateChatMessage(chatMessageObject);
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();

        if (currentUser.isNotAnonymous() && currentUser.getId() === chatMessage.getSenderUserId()) {

            var conversation = undefined;
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
                    conversation.getChatMessageIdSet().add(chatMessage.getId());
                    _this.conversationManager.updateConversation(conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.roomService.dbPopulateRoomAndRoomMembers(conversation.getOwner(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldUserWithChatMessage(meldManager, currentUser, chatMessage);
                    _this.conversationService.meldUserWithConversation(meldManager, currentUser, conversation);
                    conversation.getOwner().getRoomMemberSet().forEach(function(roomMember) {
                        _this.conversationService.meldUserWithConversation(meldManager, roomMember.getUser(), conversation);
                        _this.meldUserWithChatMessage(meldManager, roomMember.getUser(), chatMessage);
                    });
                    _this.meldChatMessage(meldManager, chatMessage);
                    _this.conversationService.meldConversation(meldManager, conversation);
                    meldManager.commitTransaction(function(throwable) {
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

    /**
     * @param {RequestContext} requestContext
     * @param {string} conversationId
     * @param {function(Throwable, ChatMessage)} callback
     */
    retrieveChatMessagesByConversationId: function(requestContext, conversationId, callback) {
        var _this = this;
        var currentUser     = requestContext.get("currentUser");
        var meldManager     = this.meldService.factoryManager();

        if (currentUser.isNotAnonymous()) {

            var chatMessageMap  = undefined;
            var conversation    = undefined;
            var mappedException = undefined;

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
                    _this.chatMessageManager.retrieveChatMessages(conversation.getChatMessageIdSet(), function(throwable, returnedChatMessageMap) {
                        if (!throwable) {
                            chatMessageMap = returnedChatMessageMap;
                            chatMessageMap.forEach(function(chatMessage, key) {
                                if (chatMessage === null) {
                                    if (!mappedException) {
                                        mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                    }
                                    mappedException.putThrowable(key, new Exception("NotFound", {objectId: key}));
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    chatMessageMap.forEach(function(chatMessage) {
                        _this.meldUserWithChatMessage(meldManager, currentUser, chatMessage);
                        _this.meldChatMessage(meldManager, chatMessage);
                        meldManager.commitTransaction(function(throwable) {
                            flow.complete(throwable);
                        });
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


    // Convenience Meld Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldManager} meldManager
     * @param {ChatMessage} chatMessage
     */
    meldChatMessage: function(meldManager, chatMessage) {
        this.meldService.meldEntity(meldManager, "ChatMessage", "basic", chatMessage);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {ChatMessage} chatMessage
     * @param {string=} reason
     */
    meldUserWithChatMessage: function(meldManager, user, chatMessage, reason) {
        var chatMessageMeldKey      = this.meldService.generateMeldKey("ChatMessage", chatMessage.getId());
        var meldKeys                = [chatMessageMeldKey];
        reason                      = reason ? reason : chatMessage.getId();

        this.meldService.meldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {ChatMessage} chatMessage
     * @param {string=} reason
     */
    unmeldUserWithChatMessage: function(meldManager, user, chatMessage, reason) {
        var conversationMeldKey     = this.meldService.generateMeldKey("ChatMessage", chatMessage.getId());
        var meldKeys                = [conversationMeldKey];
        reason                      = reason ? reason : conversation.getId();

        this.meldService.unmeldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
