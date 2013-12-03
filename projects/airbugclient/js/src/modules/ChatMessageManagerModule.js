//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')

//@Require('Class')
//@Require('UuidGenerator')
//@Require('airbug.ChatMessageList')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.CodeChatMessageModel')
//@Require('airbug.ImageChatMessageModel')
//@Require('airbug.ManagerModule')
//@Require('airbug.TextChatMessageModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var UuidGenerator           = bugpack.require('UuidGenerator');
var ChatMessageList         = bugpack.require('airbug.ChatMessageList');
var ChatMessageModel        = bugpack.require('airbug.ChatMessageModel');
var CodeChatMessageModel    = bugpack.require('airbug.CodeChatMessageModel');
var ImageChatMessageModel   = bugpack.require('airbug.ImageChatMessageModel');
var ManagerModule           = bugpack.require('airbug.ManagerModule');
var TextChatMessageModel    = bugpack.require('airbug.TextChatMessageModel');


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
     * @param {function(Throwable, Meld=)} callback
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
     * @param {IList=} dataList
     * @returns {ChatMessageList}
     */
    generateChatMessageList: function(dataList) {
        return new ChatMessageList(dataList);
    },

    /**
     * @param {{}} chatMessageObject
     * @param {Meld=} chatMessageMeld
     * @param {Meld=} senderUserMeld
     */
    generateChatMessageModel: function(chatMessageObject, chatMessageMeld, senderUserMeld) {
        var type = chatMessageObject.type || chatMessageMeld.getData().type;
        if (type === "text") {
            return this.generateTextChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
        } else if (type === "code") {
            return this.generateCodeChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
        } else if (type === "image") {
            return this.generateImageChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
        } else {
            throw new Error("ChatMessage data must specify a type");
        }
    },

    /**
     * @param {{}} chatMessageObject
     * @param {Meld=} chatMessageMeld
     * @param {Meld=} senderUserMeld
     */
    generateCodeChatMessageModel: function(chatMessageObject, chatMessageMeld, senderUserMeld) {
        return new CodeChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
    },

    /**
     * @param {{}} chatMessageObject
     * @param {Meld=} chatMessageMeld
     * @param {Meld=} senderUserMeld
     */
    generateImageChatMessageModel: function(chatMessageObject, chatMessageMeld, senderUserMeld) {
        return new ImageChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
    },

    /**
     * @param {{}} chatMessageObject
     * @param {Meld=} chatMessageMeld
     * @param {Meld=} senderUserMeld
     */
    generateTextChatMessageModel: function(chatMessageObject, chatMessageMeld, senderUserMeld) {
        return new TextChatMessageModel(chatMessageObject, chatMessageMeld, senderUserMeld);
    },

    /**
     * @param {*} chatMessageData
     * @return {*}
     */
    generateChatMessageObject: function(chatMessageData) {
        if (chatMessageData.type === "text") {
            return this.generateTextChatMessageObject(chatMessageData);
        } else if (chatMessageData.type === "code") {
            return this.generateCodeChatMessageObject(chatMessageData);
        } else if (chatMessageData.type === "image") {
            return this.generateImageChatMessageObject(chatMessageData);
        } else {
            throw new Error("ChatMessage data must specify a type");
        }
    },

    /**
     * @param {Object} chatMessageData
     * @return {{
     *      code: string.
     *      codeLanguage:   string,
     *      conversationId: string,
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string
     * }}
     */
    generateCodeChatMessageObject: function(chatMessageData) {
        var codeChatMessageObject = {
            code:           chatMessageData.code,
            codeLanguage:   chatMessageData.codeLanguage,
            conversationId: chatMessageData.conversationId,
            senderUserId:   chatMessageData.senderUserId,
            sentAt:         chatMessageData.sentAt,
            tryUuid:        chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid(),
            type:           chatMessageData.type
        };
        return codeChatMessageObject;
    },

    /**
     * @param {Object} chatMessageData
     * @return {{
     *      conversationId: string,
     *      imageUrl:       string,
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string
     * }}
     */
    generateImageChatMessageObject: function(chatMessageData) {
        var codeChatMessageObject = {
            conversationId: chatMessageData.conversationId,
            imageUrl:       chatMessageData.imageUrl,
            senderUserId:   chatMessageData.senderUserId,
            sentAt:         chatMessageData.sentAt,
            tryUuid:        chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid(),
            type:           chatMessageData.type
        };
        return codeChatMessageObject;
    },

    /**
     * @param {Object} chatMessageData
     * @return {{
     *      body:           string,
     *      conversationId: string,
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string
     * }}
     */
    generateTextChatMessageObject: function(chatMessageData) {
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
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback) {
        this.retrieve("ChatMessage", chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback) {
        this.retrieveEach("ChatMessage", chatMessageIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
