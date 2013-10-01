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
//@Require('bugflow.BugFlow')


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
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {

        this._super(mongoDataStore);

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable, Conversation)} callback
     */
    createConversation: function(conversation, callback) {
        if(!conversation.getCreatedAt()){
            conversation.setCreatedAt(new Date());
            conversation.setUpdatedAt(new Date());
        }
        this.dataStore.create(conversation.toObject(), function(throwable, dbConversation) {
            if (!throwable) {
                conversation.setId(dbConversation.id);
                callback(undefined, conversation);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     *
     */
    deleteConversation: function(conversation, callback){
        //TODO
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

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Conversation)} callback
     */
    retrieveConversation: function(conversationId, callback) {
        var _this = this;
        this.dataStore.findById(conversationId).lean(true).exec(function(error, dbConversationJson) {
            if (!error) {
                var conversation = undefined;
                if (dbConversationJson) {
                    conversation = _this.generateConversation(dbConversationJson);
                    conversation.commitDelta();
                }
                callback(undefined, conversation);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {Array.<string>} conversationIds
     * @param {function(Throwable, Map.<string, Conversation>)} callback
     */
    retrieveConversations: function(conversationIds, callback){
        var _this = this;
        this.dataStore.where("_id").in(conversationIds).lean(true).exec(function(throwable, results) {
            if(!throwable){
                var conversationMap = new Map();
                results.forEach(function(result) {
                    var conversation = _this.generateConversation(result);
                    conversation.commitDelta();
                    conversationMap.put(conversation.getId(), conversation);
                });
                conversationIds.forEach(function(conversationId) {
                    if (!conversationMap.containsKey(conversationId)) {
                        conversationMap.put(conversationId, null);
                    }
                });
                callback(undefined, conversationMap);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     *
     */
    updateConversation: function(){
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationManager', ConversationManager);
