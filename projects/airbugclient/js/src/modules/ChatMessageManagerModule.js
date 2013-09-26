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
     * @param {AirbugApi}                   airbugApi
     * @param {MeldStore}                   meldStore
     * @param {CurrentUserManagerModule}    currentUserManagerModule
     */
    _constructor: function(airbugApi, meldStore, currentUserManagerModule) {

        this._super(airbugApi, meldStore);


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
     * @param {function(error, meldbug.MeldObj)} callback
     */
    createChatMessage: function(chatMessageObj, callback){
        chatMessageObj.senderUserId    = this.currentUserManagerModule.currentUserId;
        this.create("ChatMessage", chatMessageObj, callback);
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Error, meldbug.MeldObj)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback){
        this.retrieve("ChatMessage", chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Error, Array.<meldbug.MeldObj>)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback){
        this.retrieveEach("ChatMessage", chatMessageIds, callback);
    },

    /**
     * @param {string} conversationId
     * @param {function(Error, Array.<meldbug.MeldObj>)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback){
        var _this           = this;
        var conversation    = this.meldStore.getMeld(conversationId);
        if(conversation){
            this.retrieveEach("ChatMessage", conversation.chatMessageIdSet, callback);
        } else {
            this.retrieve("Conversation", conversationId, function(error, conversationObj){
                if(!error && conversationObj){
                    _this.retrieveEach("ChatMessage", conversationobj.chatMessageIdSet, callback);
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
