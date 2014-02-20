//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Conversation')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
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
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var Conversation                = bugpack.require('airbugserver.Conversation');
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

var ConversationManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     * @param {(Array.<string> | function(Throwable, Conversation))} dependencies
     * @param {function(Throwable, Conversation)=} callback
     */
    createConversation: function(conversation, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(conversation, options, dependencies, callback);
    },

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable)} callback
     */
    deleteConversation: function(conversation, callback) {
        this.delete(conversation, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      id: string,
     *      ownerId: string,
     *      updatedAt: Date
     * }} data
     * @return {Conversation}
     */
    generateConversation: function(data) {
        var conversation = new Conversation(data);
        this.generate(conversation);
        return conversation;
    },

    /**
     * @param {Conversation} conversation
     * @param {Array.<string>} properties
     * @param {function(Throwable, Conversation)} callback
     */
    populateConversation: function(conversation, properties, callback) {
        var options = {
            chatMessageSet: {
                idGetter: conversation.getId,
                retriever: "retrieveChatMessagesByConversationId",
                setter: conversation.setChatMessageSet
            },
            owner: {
                idGetter:   conversation.getOwnerId,
                typeGetter: conversation.getOwnerType,
                getter:     conversation.getOwner,
                setter:     conversation.setOwner
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
     * @param {function(Throwable, Map.<string, Conversation>=)} callback
     */
    retrieveConversations: function(conversationIds, callback) {
        this.retrieveEach(conversationIds, callback);
    },

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable, Conversation)} callback
     */
    updateConversation: function(conversation, callback) {
        this.update(conversation, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ConversationManager).with(
    entityManager("conversationManager")
        .ofType("Conversation")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationManager', ConversationManager);
