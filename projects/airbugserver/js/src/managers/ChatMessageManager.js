//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageManager')

//@Require('Class')
//@Require('Map')
//@Require('airbugserver.ChatMessage')
//@Require('airbugserver.EntityManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Map             = bugpack.require('Map');
var ChatMessage     = bugpack.require('airbugserver.ChatMessage');
var EntityManager   = bugpack.require('airbugserver.EntityManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore, conversationManager, userManager) {

        this._super("ChatMessage", mongoDataStore);

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager            = userManager;
    },


    //-------------------------------------------------------------------------------
    // MongoManager
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable, ChatMessage)} callback
     */
    createChatMessage: function(chatMessage, callback) {
        this.create(chatMessage, callback);
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable)} callback
     */
    deleteChatMessage: function(chatMessage, callback){
        this.delete(chatMessage, callback);
    },

    /**
     * @param {{
     *      body: string,
     *      code: string,
     *      codeLanguage: string,
     *      conversationId: string,
     *      conversationOwnerId: string,
     *      createdAt: Date,
     *      senderUserId: string,
     *      sentAt: Date,
     *      tryUuid: string,
     *      type: string,
     *      updatedAt: Date
     * }} data
     * @return {ChatMessage}
     */
    generateChatMessage: function(data) {
        return new ChatMessage(data);
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {Array.<string>} properties
     * @param {function(Throwable, ChatMessage)} callback
     */
    populateChatMessage: function(chatMessage, properties, callback) {
        var _this = this;
        var options = {
            propertyNames: ["conversation", "senderUser"],
            propertyKeys: {
                conversation: {
                    idGetter:   chatMessage.getConversationId,
                    idSetter:   chatMessage.setConversationId,
                    getter:     chatMessage.getConversation,
                    setter:     chatMessage.setConversation,
                    manager:    _this.conversationManager,
                    retriever:  _this.conversationManager.retrieveConversation
                },
                senderUser: {
                    idGetter:   chatMessage.getSenderUserId,
                    idSetter:   chatMessage.setSenderUserId,
                    getter:     chatMessage.getSenderUser,
                    setter:     chatMessage.setSenderUser,
                    manager:    _this.userManager,
                    retriever:  _this.userManager.retrieveUser
                }
            }
        };
        this.populate(chatMessage, options, properties, callback);
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Throwable, ChatMessage)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback) {
        this.retrieve(chatMessageId, callback);
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Throwable, Map.<string, ChatMessage>)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback) {
        this.retrieveEach(chatMessageIds, callback);
    },

    /**
     * @param {string} senderUserId
     * @param {string} conversationId
     * @param {string} tryUuid
     * @param {function(Throwable, ChatMessage)}callback
     */
    retrieveChatMessageBySenderUserIdAndConversationIdAndTryUuid: function(senderUserId, conversationId, tryUuid, callback) {
        this.dataStore
            .where("senderUserId", senderUserId)
            .where("conversationId", conversationId)
            .where("tryUuid", tryUuid)
            .lean(true).exec(function(throwable, dbJson) {

                if (!throwable) {
                    var entityObject = null;
                    if (dbJson) {
                        entityObject = _this["generate" + _this.entityType](dbJson);
                        entityObject.commitDelta();
                    }
                    callback(undefined, entityObject);
                } else {
                    callback(throwable);
                }
            });
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable, ChatMessage)} callback
     */
    updateChatMessage: function(chatMessage, callback) {
        this.update(chatMessage, callback);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
