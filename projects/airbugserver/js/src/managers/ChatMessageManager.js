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

    populateChatMessage: function(chatMessage, properties, callback){
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
        this.populate(options, chatMessage, properties, callback);
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
     * @param {ChatMessage} chatMessage
     */
    updateChatMessage: function(chatMessage, updates, callback) {
        //TODO
        // var delta = chatMessage.generateDelta();
        // delta.getDeltaChangeList().forEach(function(deltaChange) {
        //     switch (deltaChange.getType()) {
        //         case SetChange.ChangeTypes.VALUE_ADDED:
        //             var setValue = deltaChange.getSetValue();
        //             break;
        //         case SetChange.ChangeTypes.VALUE_REMOVED:
        //             break;
        //     }
        // });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
