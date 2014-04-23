//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageManagerModule')
//@Autoload

//@Require('ArgumentBug')
//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('UuidGenerator')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug                     = bugpack.require('ArgumentBug');
    var ArgUtil                         = bugpack.require('ArgUtil');
    var Class                           = bugpack.require('Class');
    var Exception                       = bugpack.require('Exception');
    var Map                             = bugpack.require('Map');
    var TypeUtil                        = bugpack.require('TypeUtil');
    var UuidGenerator                   = bugpack.require('UuidGenerator');
    var ManagerModule                   = bugpack.require('airbug.ManagerModule');
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

    /**
     * @class
     * @extends {ManagerModule}
     */
    var ChatMessageManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.ChatMessageManagerModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AirbugApi} airbugApi
         * @param {MeldStore} meldStore
         * @param {MeldBuilder} meldBuilder
         * @param {CurrentUserManagerModule} currentUserManagerModule
         * @param {ConversationManagerModule} conversationManagerModule
         */
        _constructor: function(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule) {

            this._super(airbugApi, meldStore, meldBuilder);


            //-------------------------------------------------------------------------------
            // Private Properties
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
         *      body: {
         *          parts: Array.<Object>
         *      },
         *      senderUserId:   string,
         *      sentAt:         Date,
         *      tryUuid:        string,
         *      type:           string
         * }} chatMessageObject
         * @param {function(Throwable, MeldDocument=)} callback
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
         * @param {*} messageData
         * @return {{
         *      body: {
         *          parts: Array.<Object>
         *      },
         *      conversationId: string,
         *      failed: boolean,
         *      pending: boolean,
         *      senderUserId: string,
         *      sentAt: Date,
         *      tryUuid: string,
         *      type: string
         * }}
         */
        generateMessageObject: function(messageData) {
            return {
                body:           this.generateMessageBodyObject(messageData.body),
                conversationId: messageData.conversationId,
                failed:         messageData.failed,
                pending:        messageData.pending,
                senderUserId:   messageData.senderUserId,
                sentAt:         messageData.sentAt,
                tryUuid:        messageData.tryUuid ? messageData.tryUuid : UuidGenerator.generateUuid(),
                type:           "multipart"
            };
        },

        /**
         * @param {{
         *      parts: Array.<Object>
         * }} bodyData
         * @return {{
         *      parts: Array.<Object>
         * }}
         */
        generateMessageBodyObject: function(bodyData) {
            var _this = this;
            if (TypeUtil.isObject(bodyData)) {
                if (TypeUtil.isArray(bodyData.parts)) {
                    var parts = [];
                    bodyData.parts.forEach(function(messagePart) {
                        switch (messagePart.type) {
                            case "code":
                                parts.push(_this.generateMessagePartCodeObject(messagePart));
                                break;
                            case "image":
                                parts.push(_this.generateMessagePartImageObject(messagePart));
                                break;
                            case "text":
                                parts.push(_this.generateMessagePartTextObject(messagePart));
                                break;
                            default:
                                throw new Exception("MissingType", {}, "messagePart must declare a type")
                        }
                    });
                } else {
                    bodyData.parts = [];
                }
            } else {
                bodyData = {
                    parts: []
                };
            }
            return bodyData;
        },

        /**
         * @param {Object} messagePartData
         * @return {{
         *      code: string,
         *      codeLanguage: string,
         *      type: string
         * }}
         */
        generateMessagePartCodeObject: function(messagePartData) {
            return {
                code: messagePartData.code,
                codeLanguage: messagePartData.codeLanguage,
                type: messagePartData.type
            };
        },

        /**
         * @param {{
         *      assetId: string,
         *      midsizeMimeType: string,
         *      midsizeUrl: string,
         *      mimeType: string,
         *      thumbnailMimeType: string,
         *      thumbnailUrl: string,
         *      type: string,
         *      url: string
         * }} messagePartData
         * @return {{
         *      assetId: string,
         *      midsizeMimeType: string,
         *      midsizeUrl: string,
         *      mimeType: string,
         *      thumbnailMimeType: string,
         *      thumbnailUrl: string,
         *      type: string,
         *      url: string
         * }}
         */
        generateMessagePartImageObject: function(messagePartData) {
            return {
                assetId:            messagePartData.assetId,
                midsizeMimeType:    messagePartData.midsizeMimeType,
                midsizeUrl:         messagePartData.midsizeUrl,
                mimeType:           messagePartData.mimeType,
                thumbnailMimeType:  messagePartData.thumbnailMimeType,
                thumbnailUrl:       messagePartData.thumbnailUrl,
                type:               messagePartData.type,
                url:                messagePartData.url
            };
        },

        /**
         * @param {{
         *      type: string,
         *      text: string
         * }} messagePartData
         * @return {{
         *      type: string,
         *      text: string
         * }}
         */
        generateMessagePartTextObject: function(messagePartData) {
            return {
                text: messagePartData.text,
                type: messagePartData.type
            };
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
         * @param {function(Throwable, List.<MeldDocument>=)} callback
         */
        retrieveChatMessagesByConversationIdSortBySentAt: function(conversationId, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "conversationId", optional: false, type: "string"},
                {name: "callback", optional: false, type: "function"}
            ]);
            conversationId  = args.conversationId;
            callback        = args.callback;

            var _this       = this;
            var requestData = {conversationId: conversationId};
            var requestType = "retrieveChatMessagesByConversationIdSortBySentAt";
            this.request(requestType, requestData, function(throwable, callResponse) {
                _this.processListRetrieveResponse(throwable, callResponse, "ChatMessage", callback);
            });
        },

        /**
         * @param {string} conversationId
         * @param {function(Throwable, List.<MeldDocument>=)} callback
         */
        retrieveChatMessageBatchByConversationId: function(conversationId, index, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "conversationId", optional: false, type: "string"},
                {name: "index", optional: false, type: "number"},
                {name: "callback", optional: false, type: "function"}
            ]);
            conversationId  = args.conversationId;
            index           = args.index;
            callback        = args.callback;

            var _this       = this;
            var requestData = {
                conversationId: conversationId,
                index:          index,
                batchSize:      15,
                order:          'asc'
            };
            var requestType = "retrieveChatMessageBatchByConversationId";
            this.request(requestType, requestData, function(throwable, callResponse) {
                _this.processListRetrieveResponse(throwable, callResponse, "ChatMessage", callback);
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
});
