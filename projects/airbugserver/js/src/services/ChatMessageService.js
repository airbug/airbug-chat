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

    _constructor: function(chatMessageManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.chatMessageManager     = chatMessageManager;

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
        if(currentUser.id === chatMessage.senderUserId){
            if(currentUser.roomsList.indexOf(chatMessage.conversationOwnerId) > -1 ){
                this.chatMessageManager.createChatMessage(chatMessage, function(error, chatMessage){
                    if(!error and chatMessage){
                        callback(error, chatMessage)
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(new Error("Unauthorized Access"), null);
            }
        } else {
            callback(new Error("Unauthorized Access"), null);
        }
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageService', ChatMessageService);
