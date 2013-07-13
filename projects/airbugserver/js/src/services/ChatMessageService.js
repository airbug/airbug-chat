//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageService')

//@Require('Class')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageManager, conversationManager, userManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.chatMessageManager     = chatMessageManager;

        this.conversationManager    = conversationManager;

        this.userManager            = userManager; //Temporary

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} currentUser
     * @param {{
     *      conversationOwnerId: ObjectId,
     *      conversationId: ObjectId
     *      senderUserId: ObjectId
     *      body: string
     * }} chatMessage
     * @param {function(Error, ChatMessage)} callback
     */
    createChatMessage: function(currentUser, chatMessage, callback) {
        var _this = this;
        console.log("Inside ChatMessageService#createChatMessage");
        if(currentUser.id === chatMessage.senderUserId){
            console.log("Inside ChatMessageService#createChatMessage. currentUserId matches senderUserId");

            // TODO: Redo this using syncBugClient
            // if(currentUser.roomsList.indexOf(chatMessage.conversationOwnerId) > -1 ){
            //     console.log("Inside ChatMessageService#createChatMessage. currentUser roomslist contains chatMessage.conversationOwnerId");

                if(chatMessage.retry){
                    delete chatMessage.retry;
                    this.chatMessageManager.findOne(chatMessage, function(error, chatMessage){
                        if(!error){
                            if(chatMessage){
                                callback(error, chatMessage);
                            } else {
                                this.chatMessageManager.create(chatMessage, function(error, chatMessage){
                                    if(!error && chatMessage){
                                        //TODO
                                        _this.conversationManager.findById(chatMessage.conversationId, function(error, conversation){
                                            if(!error && conversation) {
                                                conversation.chatMessageIdList.push(chatMessage.id);
                                                conversation.save(function(error, conversation){
                                                    //TODO
                                                });
                                            } else {
                                                //TODO
                                            }
                                        });
                                        callback(error, chatMessage)
                                    } else {
                                        callback(error);
                                    }
                                });
                            }
                        } else {
                            //TODO
                        }
                    });
                } else {
                    this.chatMessageManager.create(chatMessage, function(error, chatMessage){
                        if(!error && chatMessage){
                            //TODO
                            _this.conversationManager.findById(chatMessage.conversationId, function(error, conversation){
                                if(!error && conversation) {
                                    conversation.chatMessageIdList.push(chatMessage.id);
                                    conversation.save(function(error, conversation){
                                        //TODO
                                    });
                                } else {
                                    //TODO
                                }
                            });
                            callback(error, chatMessage)
                        } else {
                            callback(error);
                        }
                    });
                }

            // } else {
            //     callback(new Error("Unauthorized Access"), null);
            // }
        } else {
            callback(new Error("Unauthorized Access"), null);
        }
    },

    retrieveChatMessagesByConversationId: function(currentUser, conversationId, callback){
        // TODO REFACTOR Reduce db calls
        var _this = this;
        console.log("conversationId:", conversationId);
        //TODO
        //Refactor this so that you only make one call and it returns a populated messageList
        this.conversationManager.findById(conversationId).lean(true).exec(function(error, conversation){
            console.log("Inside ChatMessageService#retrieveChatMessagesByConversationId callback");
            console.log("Error:", error, "Conversation:", conversation);
            if(!error && conversation){

                //TODO
                // if(currentUser.roomsList.indexOf(conversation.ownerId) > -1){
                    _this.chatMessageManager
                        .find({conversationId: conversationId})
                        .lean(true)
                        .exec(function(error, chatMessages){
                            callback(error, chatMessages);
                        });
                // } else {
                //     callback(new Error("Unauthorized Access"), null);
                // }
            } else {
                //TODO
                callback(error, []);
            }
        });
    },

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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
