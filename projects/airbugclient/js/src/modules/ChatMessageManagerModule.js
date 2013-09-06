//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {airbug.AirBugApi}                airbugApi
     * @param {meldbug.MeldObjectManager}       meldObjectManagerModule
     * @param {airbug.CurrentUserManagerModule} currentUserManagerModule
     */
    _constructor: function(airbugApi, meldObjectManagerModule, currentUserManagerModule) {

        this._super(airbugApi, meldObjectManagerModule);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule           = currentUserManagerModule;

    },

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      conversationOwnerId: {string},
     *      conversationId: {string},
     *      senderUserId: {string},
     *      messageBody: {string}
     * }} chatMessageObj
     * @param {function(error, chatMessageObj)} callback
     */
    createChatMessage: function(chatMessageObj, callback){
        chatMessageObj.senderUserId    = this.currentUserManagerModule.currentUserId;
        this.create("ChatMessage", chatMessageObj, callback);
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Error, MeldObject)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback){
        this.retrieve("ChatMessage", chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Error, Array.<MeldObject>)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback){
        this.retrieveEach("ChatMessage", chatMessageIds, callback);
    },

    /**
     * @param {string} conversationId
     * @param {function(Error, Array.<MeldObject>)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback){
        var _this           = this;
        var conversation    = this.meldObjectManagerModule.getMeldObject(conversationId);
        if(conversation){
            this.retrieveEach("ChatMessage", conversation.chatMessageIdList, callback);
        } else {
            this.retrieve("Conversation", conversationId, function(error, conversationObj){
                if(!error && conversationObj){
                    _this.retrieveEach("ChatMessage", conversationobj.chatMessageIdList, callback);
                } else {
                    callback(error, null);
                }
            });
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
