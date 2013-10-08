//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Exception   = bugpack.require('Exception');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $task       = BugFlow.$task;
var $series     = BugFlow.$series;


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
        var meldService     = this.meldService;

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
                $task(function(flow){
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
                    })
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
     * @param {User} currentUser
     * @param {string} conversationId
     * @param {function(Throwable, ChatMessage)} callback
     */
    retrieveChatMessagesByConversationId: function(currentUser, conversationId, callback){
        var _this = this;
        // Alternative
        // this.chatMessageManager.where({conversationId: conversationId}).exec(function(){
        //
        // });
        this.conversationManager.findById(conversationId).populate("chatMessageIdSet").lean(true).exec(function(error, conversation){
            console.log("Inside ChatMessageService#retrieveChatMessagesByConversationId callback");
            console.log("Error:", error, "Conversation:", conversation);
            if(!error && conversation){
                var chatMessages = conversation.chatMessageIdSet;
                callback(error, chatMessages);
            } else {
                callback(error, conversation);
            }
        });
    },

    /**
     * @param {User} currentUser
     * @param {string} roomId
     * @param {function(Error, ChatMessage)} callback
     */
    retrieveChatMessagesByRoomId: function(currentUser, roomId, callback){
        var _this = this;
        if(currentUser.roomsList.indexOf(roomId) > -1){
            this.chatMessageManager
                .find({conversationOwnerId: roomId})
                .lean(true)
                .exec(function(error, chatMessages){
                    callback(error, chatMessages);
                });
        } else {
            callback(new Error("Unauthorized Access"), null);
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
     */
    meldUserWithChatMessage: function(meldManager, user, chatMessage) {
        var _this                           = this;
        var meldKeys                        = [roomMeldKey];
        var meldManager                     = this.meldManagerFactory.factoryManager();
        var meldUserWithRoomMembersSwitch   = false;
        var meldService                     = this.meldService;
        var reason                          = room.getId();
        var roomMeldKey                     = this.meldService.generateMeldKey("Room", room.getId(), "basic");
        var selfUserMeldKey                 = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var selfRoomMemberMeldKey           = undefined;

        $series([
            $task(function(flow){
                _this.roomMemberManager.retrieveRoomMemberByUserIdAndRoomId(user.getId(), room.getId(), function(throwable, roomMember){
                    if(!throwable && roomMember){
                        meldUserWithRoomMembersSwitch   = true;
                        selfRoomMemberMeldKey           = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                room.getRoomMemberSet().forEach(function(roomMember) {
                    var roomMemberMeldKey   = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
                    var roomMemberUser      = roomMember.getUser();
                    meldKeys.push(roomMemberMeldKey);
                    if (roomMemberUser) {
                        var userMeldKey = meldService.generateMeldKey("User", user.getId(), "basic");
                        meldKeys.push(userMeldKey);
                        if(meldUserWithRoomMembersSwitch) meldService.meldUserWithKeysAndReason(roomMemberUser, [selfUserMeldKey, selfRoomMemberMeldKey], reason);
                    }
                });
                flow.complete();
            })
        ]).execute(function(throwable){
                if(!throwable) {
                    meldService.meldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
                } else {
                    throw throwable;
                }
            });
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Room} room
     */
    unmeldUserWithRoom: function(meldManager, user, room){
        var meldService = this.meldService;
        var meldKeys    = [roomMeldKey];
        var reason      = room.getId();
        var roomMeldKey = meldService.generateMeldKey("Room", room.getId(), "basic");

        room.getRoomMemberSet().forEach(function(roomMember) {
            var roomMemberMeldKey   = meldService.generateMeldKey("RoomMember", roomMember.getId(), "basic");
            var roomMemberUser      = roomMember.getUser();
            meldKeys.push(roomMemberMeldKey);
            if (roomMemberUser) {
                var userMeldKey = meldService.generateMeldKey("User", user.getId(), "basic");
                meldKeys.push(userMeldKey);
            }
        });
        this.meldService.unmeldUserWithKeysAndReason(user, meldKeys, reason);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
