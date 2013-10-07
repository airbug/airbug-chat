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
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {CurrentUserManagerModule} currentUserManagerModule
     * @param {ConversationManagerModule} conversationManagerModule
     */
    _constructor: function(airbugApi, meldStore, currentUserManagerModule, conversationManagerModule) {

        this._super(airbugApi, meldStore);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationManagerModule}
         */
        this.conversationManagerModule          = conversationManagerModule;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule           = currentUserManagerModule;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      conversationId: {string},
     *      senderUserId: {string},
     *      messageBody: {string}
     * }} chatMessageObject
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    createChatMessage: function(chatMessageObject, callback) {

        //TODO BRN: This needs to be redone. We should be calling to the currentUserManagerModule to retrieve the current user

        chatMessageObject.senderUserId    = this.currentUserManagerModule.getCurrentUserId();
        this.create("ChatMessage", chatMessageObject, callback);
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback) {
        this.retrieve("ChatMessage", chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Throwable, Map.<meldbug.MeldDocument>)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback) {
        this.retrieveEach("ChatMessage", chatMessageIds, callback);
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Map.<meldbug.MeldDocument>)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback) {
        var _this = this;
        this.conversationManagerModule.retrieveConversation(conversationId, function(throwable, conversationMeldDocument) {
            if (!throwable) {
                _this.retrieveEach("ChatMessage", conversationMeldDocument.getData().chatMessageIdSet, callback);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
