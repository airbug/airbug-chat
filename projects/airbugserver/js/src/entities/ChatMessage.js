//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessage')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.IndexTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityTag        = bugpack.require('bugentity.EntityTag');
var IndexTag         = bugpack.require('bugentity.IndexTag');
var PropertyTag      = bugpack.require('bugentity.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityTag.entity;
var index                   = IndexTag.index;
var property                = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
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
        return this.getEntityData().body;
    },

    /**
     * @param {string} body
     */
    setBody: function(body) {
        this.getEntityData().body = body;
    },

    /**
     * @return {string}
     */
    getConversationId: function() {
        return this.getEntityData().conversationId;
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.getEntityData().conversationId = conversationId;
    },

    /**
     * @return {number}
     */
    getIndex: function() {
        return this.getEntityData().index;
    },

    /**
     * @param {number} index
     */
    setIndex: function(index) {
        this.getEntityData().index = index;
    },

    /**
     * @return {string}
     */
    getSenderUserId: function() {
        return this.getEntityData().senderUserId;
    },

    /**
     * @param {string} senderUserId
     */
    setSenderUserId: function(senderUserId) {
        this.getEntityData().senderUserId = senderUserId;
    },

    /**
     * @return {Date}
     */
    getSentAt: function() {
        return this.getEntityData().sentAt;
    },

    /**
     * @param {Date} sentAt
     */
    setSentAt: function(sentAt) {
        this.getEntityData().sentAt = sentAt;
    },

    /**
     * @return {string}
     */
    getTryUuid: function() {
        return this.getEntityData().tryUuid;
    },

    /**
     * @param {string} tryUuid
     */
    setTryUuid: function(tryUuid) {
        this.getEntityData().tryUuid = tryUuid;
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
            throw new Bug("IllegalState", {}, "Conversation must have an id first");
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
            throw new Bug("IllegalState", {}, "senderUser must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(ChatMessage).with(
    entity("ChatMessage")
        .properties([
            property("body")
                .type("mixed"),
            property("conversationId")
                .type("string")
                .index(true)
                .require(true)
                .id(),
            property("conversation")
                .type("Conversation")
                .populates(true)
                .store(false),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("index")
                .type("number")
                .index(true)
                .require(true)
                .default(-1),
            property("senderUserId")
                .type("string")
                .index(true)
                .require(true)
                .id(),
            property("senderUser")
                .type("User")
                .populates(true)
                .store(false),
            property("sentAt")
                .type("date")
                .index(true)
                .require(true),
            property("tryUuid")
                .type("string")
                .index(true)
                .require(true),
            property("type")
                .type("string")
                .require(true),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now)
        ])
        .indexes([
            index({conversationId: 1, index: 1})
                .unique(true)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessage', ChatMessage);
