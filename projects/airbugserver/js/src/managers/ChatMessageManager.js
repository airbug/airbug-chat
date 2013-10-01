//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageManager')

//@Require('Class')
//@Require('Map')
//@Require('airbugserver.ChatMessage')
//@Require('airbugserver.EntityManager')
//@Require('bugflow.BugFlow')


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
var BugFlow         = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel       = BugFlow.$parallel;
var $series         = BugFlow.$series;
var $task           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {

        this._super("ChatMessage", mongoDataStore);

    },


    //-------------------------------------------------------------------------------
    // MongoManager
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable, ChatMessage)} callback
     */
    createChatMessage: function(chatMessage, callback) {
        if(!chatMessage.getCreatedAt()){
            chatMessage.setCreatedAt(new Date());
            chatMessage.setUpdatedAt(new Date());
        }
        this.dataStore.create(chatMessage.toObject(), function(throwable, dbChatMessage) {
            if (!throwable) {
                chatMessage.setId(dbChatMessage.id);
                callback(undefined, chatMessage);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {ChatMessage} chatMessage
     * @param {function(Throwable)} callback
     */
    deleteChatMessage: function(chatMessage, callback){
        //TODO
    },

    /**
     * @param {{
        * body: string,
        * code: string,
        * codeLanguage: string,
        * conversationId: string,
        * conversationOwnerId: string,
        * createdAt: Date,
        * senderUserId: string,
        * sentAt: Date,
        * type: string,
        * updatedAt: Date
     * }} data
     * @return {ChatMessage}
     */
    generateChatMessage: function(data) {
        return new ChatMessage(data);
    },

    /**
     * @param {string} chatMessageId
     * @param {function(Throwable, ChatMessage)} callback
     */
    retrieveChatMessage: function(chatMessageId, callback) {
        var _this = this;
        this.dataStore.findById(chatMessageId).lean(true).exec(function(throwable, dbChatMessageJson) {
            if (!throwable) {
                var chatMessage = null;
                if (dbChatMessageJson) {
                    chatMessage = _this.generateChatMessage(dbChatMessageJson);
                    chatMessage.commitDelta();
                }
                callback(undefined, chatMessage);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} chatMessageIds
     * @param {function(Throwable, Map.<string, ChatMessage>)} callback
     */
    retrieveChatMessages: function(chatMessageIds, callback) {
        var _this = this;
        this.dataStore.where("_id").in(chatMessageIds).lean(true).exec(function(throwable, results) {
            if(!throwable){
                var chatMessageMap = new Map();
                results.forEach(function(result) {
                    var chatMessage = _this.generateChatMessage(result);
                    chatMessage.commitDelta();
                    chatMessageMap.put(chatMessage.getId(), chatMessage);
                });
                chatMessageIds.forEach(function(chatMessageId) {
                    if (!chatMessageMap.containsKey(chatMessageId)) {
                        chatMessageMap.put(chatMessageId, null);
                    }
                });
                callback(undefined, chatMessageMap);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {}
     */
    updateChatMessage: function() {
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
