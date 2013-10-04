//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageService')

//@Require('Class')
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
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');

var $task       = BugFlow.$task;
var $series     = BugFlow.$series;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageManager, conversationManager){

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
        var returnedChatMessage;
        console.log("Inside ChatMessageService#createChatMessage");
        if(currentUser.id === chatMessage.senderUserId){
            console.log("currentUserId matches senderUserId");
            // TODO: Redo this using syncBugClient
            // if(currentUser.roomsList.indexOf(chatMessage.conversationOwnerId) > -1 ){
            //     console.log("Inside ChatMessageService#createChatMessage. currentUser roomslist contains chatMessage.conversationOwnerId");
            $series([
                $task(function(flow){
                    if(chatMessage.retry){
                        delete chatMessage.retry;
                        _this.chatMessageManager.findOne(chatMessage, function(error, chatMessage){
                            if(!error && chatMessage){
                                flow.error(new Error("chatmessage already exists"));
                            } else {
                                flow.complete(error);
                            }
                        })
                    } else {
                        flow.complete();
                    }
                }),
                $task(function(flow){
                    _this.chatMessageManager.create(chatMessage, function(error, chatMessage){
                        console.log("error:", error, "chatMessage:", chatMessage);
                        returnedChatMessage = chatMessage;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    if(returnedChatMessage){
                        _this.conversationManager.findById(returnedChatMessage.conversationId, function(error, conversation){
                            if(!error && conversation){
                                conversation.chatMessageIdSet.push(returnedChatMessage.id);
                                console.log("updated conversation:", conversation);
                                conversation.save(function(error, conversation){
                                        console.log("error", error, "conversation:", conversation);
                                        flow.complete(error);
                                });
                            } else {
                                flow.complete(error);
                            }
                        });
                    } else {
                        flow.error(new Error("chatMessage could not be created"));
                    }
                })
            ]).execute(function(error){
                callback(error, returnedChatMessage);
            });
        } else {
            callback(new Error("Unauthorized Access"), null);
        }
    },

    /**
     * @param {User} currentUser
     * @param {string} conversationId
     * @param {function(Error, ChatMessage)} callback
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
