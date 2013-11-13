//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')

//@Require('Class')
//@Require('UuidGenerator')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var UuidGenerator   = bugpack.require('UuidGenerator');
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
     * @param {MeldBuilder} meldBuilder
     * @param {CurrentUserManagerModule} currentUserManagerModule
     * @param {ConversationManagerModule} conversationManagerModule
     */
    _constructor: function(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule) {

        this._super(airbugApi, meldStore, meldBuilder);


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
        var _this = this;
        this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
            if (!throwable) {
                chatMessageObject.senderUserId = currentUser.getId();
                _this.create("ChatMessage", chatMessageObject, callback);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {*} chatMessageData
     * @return {*}
     */
    generateChatMessage: function(chatMessageData) {
        if (chatMessageData.type === "text") {
            return this.generateTextChatMessage(chatMessageData);
        } else if (chatMessageData.type === "code") {
            return this.generateCodeChatMessage(chatMessageData);
        } else {
            throw new Error("ChatMessage data must specify a type");
        }
    },

    /**
     * @param {*} chatMessageData
     * @return {*}
     */
    generateCodeChatMessage: function(chatMessageData) {
        var codeChatMessageObject = {};
        codeChatMessageObject.code              = chatMessageData.code;
        codeChatMessageObject.codeLanguage      = chatMessageData.codeLanguage;
        codeChatMessageObject.conversationId    = chatMessageData.conversationId;
        codeChatMessageObject.senderUserId      = chatMessageData.senderUserId;
        codeChatMessageObject.sentAt            = chatMessageData.sentAt;
        codeChatMessageObject.tryUuid           = chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid();
        codeChatMessageObject.type              = chatMessageData.type;
        return codeChatMessageObject;
    },

    /**
     * @param {*} chatMessageData
     * @return {*}
     */
    generateTextChatMessage: function(chatMessageData) {
        var textChatMessageObject = {};
        textChatMessageObject.body              = chatMessageData.body;
        textChatMessageObject.conversationId    = chatMessageData.conversationId;
        textChatMessageObject.senderUserId      = chatMessageData.senderUserId;
        textChatMessageObject.sentAt            = chatMessageData.sentAt;
        textChatMessageObject.tryUuid           = chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid();
        textChatMessageObject.type              = chatMessageData.type;
        return textChatMessageObject;
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
     * @param {function(Throwable, Map.<string, meldbug.MeldDocument>)} callback
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
