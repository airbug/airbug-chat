//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessage')

//@Require('Class')
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

var ChatMessage = Class.extend(Entity, {

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
        this.conversation           = undefined;

        /**
         * @private
         * @type {User}
         */
        this.senderUser             = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getBody: function() {
        return this.deltaDocument.getData().body;
    },

    /**
     * @param {string} body
     */
    setBody: function(body) {
        this.deltaDocument.getData().body = body;
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
     * @return {string}
     */
    getSenderUserId: function() {
        return this.deltaDocument.getData().senderUserId;
    },

    /**
     * @param {string} senderUserId
     */
    setSenderUserId: function(senderUserId) {
        this.deltaDocument.getData().senderUserId = senderUserId;
    },

    /**
     * @return {Date}
     */
    getSentAt: function() {
        return this.deltaDocument.getData().sentAt;
    },

    /**
     * @param {Date} sentAt
     */
    setSentAt: function(sentAt) {
        this.deltaDocument.getData().sentAt = sentAt;
    },

    /**
     * @return {string}
     */
    getTryUuid: function() {
        return this.deltaDocument.getData().tryUuid;
    },

    /**
     * @param {string} tryUuid
     */
    setTryUuid: function(tryUuid) {
        this.deltaDocument.getData().tryUuid = tryUuid;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Conversation}
     */
    getConversation: function() {
        return this.conversation;
    },

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
     * @return {User}
     */
    getSenderUser: function() {
        return this.senderUser;
    },

    /**
     * @param {User} senderUser
     */
    setSenderUser: function(senderUser) {
        if (senderUser.getId()) {
            this.senderUser = senderUser;
            this.setSenderUserId(senderUser.getId());
        } else {
            throw new Error("senderUser must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessage).with(
    entity("ChatMessage").properties([
        property("body")
            .type("string"),
        property("code")
            .type("string"),
        property("codeLanguage")
            .type("string"),
        property("conversationId")
            .type("string")
            .id(),
        property("conversation")
            .type("Conversation")
            .populates(true),
        property("createdAt")
            .type("date"),
        property("id")
            .type("string")
            .primaryId(),
        property("senderUserId")
            .type("string")
            .id(),
        property("senderUser")
            .type("User")
            .populates(true)
            .stored(false),
        property("sentAt")
            .type("date"),
        property("tryUuid")
            .type("string"),
        property("type")
            .type("string"),
        property("updatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
