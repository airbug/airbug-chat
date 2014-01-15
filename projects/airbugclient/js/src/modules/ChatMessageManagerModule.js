//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageManagerModule')
//@Autoload

//@Require('ArgumentBug')
//@Require('ArgUtil')
//@Require('Class')
//@Require('Map')
//@Require('UuidGenerator')
//@Require('airbug.ChatMessageList')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.CodeChatMessageModel')
//@Require('airbug.ImageChatMessageModel')
//@Require('airbug.ManagerModule')
//@Require('airbug.TextChatMessageModel')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug                     = bugpack.require('ArgumentBug');
var ArgUtil                         = bugpack.require('ArgUtil');
var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var UuidGenerator                   = bugpack.require('UuidGenerator');
var ChatMessageList                 = bugpack.require('airbug.ChatMessageList');
var ChatMessageModel                = bugpack.require('airbug.ChatMessageModel');
var CodeChatMessageModel            = bugpack.require('airbug.CodeChatMessageModel');
var ImageChatMessageModel           = bugpack.require('airbug.ImageChatMessageModel');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var TextChatMessageModel            = bugpack.require('airbug.TextChatMessageModel');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


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
     *      body: {parts: Array.<{*}>}
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string
     * }} chatMessageObject
     * @param {function(Throwable, Meld=)} callback
     */
    createChatMessage: function(chatMessageObject, callback) {
        var _this = this;
        if (!chatMessageObject.conversationId) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "chatMessageObject", chatMessageObject, "parameter must be an object and must supply the conversationId property");
        }
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
     *      type:           string,
     *      pending:        boolean,
     *      failed:         boolean
     * }}
     */
    generateCodeChatMessageObject: function(chatMessageData) {
        var codeChatMessageObject = {
            body:           chatMessageData.body,
            conversationId: chatMessageData.conversationId,
            senderUserId:   chatMessageData.senderUserId,
            sentAt:         chatMessageData.sentAt,
            tryUuid:        chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid(),
            type:           chatMessageData.type,
            failed:         chatMessageData.failed,
            pending:        chatMessageData.pending
        };
        return codeChatMessageObject;
    },

    /**
     * @param {Object} chatMessageData
     * @return {{
     *      conversationId: string,
     *      body:           {
     *          parts: Array.<{
     *          id: string
     *          createdAt: Date,
     *          midsizeMimeType: string,
     *          midsizeUrl: string,
     *          mimeType: string,
     *          name: string,
     *          thumbMimeType: string,
     *          thumbnailUrl: string,
     *          type: string,
     *          updatedAt: Date,
     *          url: string,
     *          thumbnailUrl: string
     *          }>
     *      },
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string,
     *      pending:        boolean,
     *      failed:         boolean
     * }}
     */
    generateImageChatMessageObject: function(chatMessageData) {
        console.log("chatMessageData:", chatMessageData);
        var imageChatMessageObject = {
            body:           chatMessageData.body,
            conversationId: chatMessageData.conversationId,
            senderUserId:   chatMessageData.senderUserId,
            sentAt:         chatMessageData.sentAt,
            tryUuid:        chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid(),
            type:           chatMessageData.type,
            failed:         chatMessageData.failed,
            pending:        chatMessageData.pending
        };
        console.log("imageChatMessageObject:", imageChatMessageObject);
        return imageChatMessageObject;
    },

    /**
     * @param {{
     *      type: string
     *      body: string
     * }} chatMessageData
     * @return {{
     *      conversationId: string,
     *      body:           {
     *          parts: Array.<{
     *          id: string
     *          type: string,
     *          text: string
     *          }>
     *      },
     *      senderUserId:   string,
     *      sentAt:         Date,
     *      tryUuid:        string,
     *      type:           string,
     *      pending:        boolean,
     *      failed:         boolean
     * }}
     * */
    generateTextChatMessageObject: function(chatMessageData) {
        var textChatMessageObject = {
            body:           chatMessageData.body,
            conversationId: chatMessageData.conversationId,
            senderUserId:   chatMessageData.senderUserId,
            sentAt:         chatMessageData.sentAt,
            tryUuid:        chatMessageData.tryUuid ? chatMessageData.tryUuid : UuidGenerator.generateUuid(),
            type:           chatMessageData.type,
            failed:         chatMessageData.failed,
            pending:        chatMessageData.pending
        };
        return textChatMessageObject;
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback) {
        this.retrieve("ChatMessage", chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback) {
        this.retrieveEach("ChatMessage", chatMessageIds, callback);
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "conversationId", optional: false, type: "string"},
            {name: "callback", optional: false, type: "function"}
        ]);
        conversationId  = args.conversationId;
        callback        = args.callback;

        var _this       = this;
        var retrievedMeldMap   = new Map();

        var requestData = {conversationId: conversationId};
        var requestType = "retrieveChatMessagesByConversationId";
        this.request(requestType, requestData, function(throwable, callResponse) {
            _this.processMappedRetrieveResponse(throwable, callResponse, retrievedMeldMap, "ChatMessage", callback);
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageManagerModule).with(
    module("chatMessageManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder"),
            arg().ref("currentUserManagerModule"),
            arg().ref("conversationManagerModule")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageManagerModule", ChatMessageManagerModule);
