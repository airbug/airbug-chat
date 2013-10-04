//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationManager')

//@Require('Class')
//@Require('Map')
//@Require('Set')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.EntityManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Set                 = bugpack.require('Set');
var Conversation        = bugpack.require('airbugserver.Conversation');
var EntityManager       = bugpack.require('airbugserver.EntityManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;
var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore, chatMessageManager) {

        this._super("Conversation", mongoDataStore);

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.chatMessageManager    = chatMessageManager;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable, Conversation)} callback
     */
    createConversation: function(conversation, callback) {
        this.create(conversation, callback);
    },

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable)} callback
     */
    deleteConversation: function(conversation, callback){
        this.delete(conversation, callback);
    },

    /**
     * @param {{
     *      chatMessageIdSet: (Array.<string> | Set.<string>),
     *      createdAt: Date,
     *      id: string,
     *      ownerId: string,
     *      updatedAt: Date
     * }} data
     * @return {Conversation}
     */
    generateConversation: function(data) {
        data.chatMessageIdSet = new Set(data.chatMessageIdSet);
        return new Conversation(data);
    },

    populateConversation: function(conversation, properties, callback){
        var options = {
            propertyNames: ["chatMessageSet", "owner"],
            propertyKeys: {
                chatMessageSet: {
                    type:       "Set",
                    idGetter:   conversation.getChatMessageIdSet,
                    idSetter:   conversation.setChatMessageIdSet,
                    getter:     conversation.getChatMessageSet,
                    setter:     conversation.setChatMessageSet,
                    manager:    _this.chatMessageManager,
                    retriever:  _this.chatMessageManager.retrieveChatMessage
                },
                owner: {
                    idGetter:   conversation.getOwnerId,
                    idSetter:   conversation.setOwnerId,
                    getter:     conversation.getOwner,
                    setter:     conversation.setOwner,
                    manager:    _this.roomManager,
                    retriever:  _this.roomManager.retrieveRoom
                }
            }
        };
        this.populate(conversation, options, properties, callback);
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Conversation)} callback
     */
    retrieveConversation: function(conversationId, callback) {
        this.retrieve(conversationId, callback);
    },

    /**
     * @param {Array.<string>} conversationIds
     * @param {function(Throwable, Map.<string, Conversation>)} callback
     */
    retrieveConversations: function(conversationIds, callback){
        this.retrieveEach(conversationIds, callback);
    },

    /**
     * @param {Conversation} conversation 
     * @param {function(Throwable, Conversation)} callback
     */
    updateConversation: function(conversation, callback){
        this.update(conversation, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationManager', ConversationManager);
