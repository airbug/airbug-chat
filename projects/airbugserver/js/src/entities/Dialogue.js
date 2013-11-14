//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Dialogue')

//@Require('Class')
//@Require('Pair')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Pair                    = bugpack.require('Pair');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Dialogue = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Conversation}
         */
        this.conversation   = undefined;

        /**
         * @private
         * @type {Pair.<User, User>}
         */
        this.userPair       = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Conversation}
     */
    getConversation: function() {
        return this.conversation;
    },

    /**
     * @return {string}
     */
    getConversationId: function() {
        return this.deltaDocument.getData().conversationId;
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.deltaDocument.getData().conversationId = conversationId;
    },

    /**
     * @return {Pair.<string, string>}
     */
    getUserIdPair: function() {
        return this.deltaDocument.getData().userIdPair;
    },

    /**
     * @param {Pair.<string, string>} userIdPair
     */
    setUserIdPair: function(userIdPair) {
        this.deltaDocument.getData().userIdPair = userIdPair;
    },

    /**
     * @return {Pair.<User, User>}
     */
    getUserPair: function() {
        return this.userPair;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     */
    setConversation: function(conversation) {
        if (conversation.getId()) {
            this.conversation = conversation;
            this.setConversationId(conversation.getId());
        } else {
            throw new Error("Conversation must have an id first");
        }
    },

    /**
     * @param {Pair.<User, User>} userPair
     */
    setUserPair: function(userPair) {
        this.userPair = userPair;
        //TODO BRN:
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Dialogue).with(
    entity("Dialogue").properties([
        property("conversation")
            .type("Conversation")
            .populates(true)
            .stored(false),
        property("conversationId")
            .type("string")
            .id(),
        property("createdAt")
            .type("date"),
        property("id")
            .type("string")
            .primaryId(),
        property("updatedAt")
            .type("date"),
        property("userIdPair")
            .type("object"),
        property("userPair")
            .type("Pair")
            .populates(true)
            .stored(false)
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Dialogue', Dialogue);
