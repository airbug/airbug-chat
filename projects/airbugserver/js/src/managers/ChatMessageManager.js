//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageManager')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.ChatMessage')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var ChatMessage                 = bugpack.require('airbugserver.ChatMessage');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // MongoManager
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessage} chatMessage
     * @param {(Array.<string> | function(Throwable, ChatMessage))} dependencies
     * @param {function(Throwable, ChatMessage=)=} callback
     */
    createChatMessage: function(chatMessage, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(chatMessage, options, dependencies, callback);
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable)} callback
     */
    deleteChatMessage: function(chatMessage, callback) {
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
        var chatMessage = new ChatMessage(data);
        this.generate(chatMessage);
        return chatMessage;
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {Array.<string>} properties
     * @param {function(Throwable, ChatMessage)} callback
     */
    populateChatMessage: function(chatMessage, properties, callback) {
        var options = {
            conversation: {
                idGetter:   chatMessage.getConversationId,
                getter:     chatMessage.getConversation,
                setter:     chatMessage.setConversation
            },
            senderUser: {
                idGetter:   chatMessage.getSenderUserId,
                getter:     chatMessage.getSenderUser,
                setter:     chatMessage.setSenderUser
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
     * @param {function(Throwable, ChatMessage=)} callback
     */
    retrieveChatMessageBySenderUserIdAndConversationIdAndTryUuid: function(senderUserId, conversationId, tryUuid, callback) {
        var _this = this;
        this.dataStore
            .where("senderUserId", senderUserId)
            .where("conversationId", conversationId)
            .where("tryUuid", tryUuid)
            .lean(true)
            .exec(function(throwable, dbObject) {
                if (!throwable) {
                    var entityObject = null;
                    if (dbObject) {
                        if(!TypeUtil.isArray(dbObject) || dbObject.length > 0){
                            entityObject = _this.convertDbObjectToEntity(dbObject);
                            entityObject.commitDelta();
                        }
                    }
                    callback(null, entityObject);
                } else {
                    callback(throwable);
                }
            });
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Set.<ChatMessage>=)} callback
     */
    retrieveChatMessagesByConversationId: function(conversationId, callback) {
        var _this = this;
        this.getDataStore().find({conversationId: conversationId}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newSet = new Set();
                dbObjects.forEach(function(dbObject) {
                    var chatMessage = _this.convertDbObjectToEntity(dbObject);
                    chatMessage.commitDelta();
                    newSet.add(chatMessage);
                });
                callback(null, newSet);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, List.<ChatMessage>=)} callback
     */
    retrieveChatMessagesByConversationIdSortBySentAt: function(conversationId, callback) {
        var _this = this;
        this.dataStore.find({conversationId: conversationId}).sort({sentAt: 1}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newList = new List();
                dbObjects.forEach(function(dbObject) {
                    var chatMessage = _this.convertDbObjectToEntity(dbObject);
                    chatMessage.commitDelta();
                    newList.add(chatMessage);
                });
                callback(null, newList);
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageManager).with(
    entityManager("chatMessageManager")
        .ofType("ChatMessage")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
