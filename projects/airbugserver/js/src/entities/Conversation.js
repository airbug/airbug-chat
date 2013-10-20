//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Conversation')

//@Require('Class')
//@Require('Set')
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
var Set                     = bugpack.require('Set');
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

var Conversation = Class.extend(Entity, {

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
         * @type {Set.<ChatMessage>}
         */
        this.chatMessageSet     = new Set();

        /**
         * @private
         * @type {(Dialogue | Room)}
         */
        this.owner              = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<string>}
     */
    getChatMessageIdSet: function() {
        return this.deltaDocument.getData().chatMessageIdSet;
    },

    /**
     * @param {Set.<string>} chatMessageIdSet
     */
    setChatMessageIdSet: function(chatMessageIdSet) {
        this.deltaDocument.getData().chatMessageIdSet = chatMessageIdSet;
    },

    /**
     * @return {string}
     */
    getOwnerId: function() {
        return this.deltaDocument.getData().ownerId;
    },

    /**
     * @param {string} ownerId
     */
    setOwnerId: function(ownerId) {
        this.deltaDocument.getData().ownerId = ownerId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} chatMessageId
     */
    addChatMessageId: function(chatMessageId) {
        var chatMessageIdSet = this.getChatMessageIdSet();
        if (!chatMessageIdSet) {
            chatMessageIdSet = new Set();
            this.setChatMessageIdSet(chatMessageIdSet);
        }
        chatMessageIdSet.add(chatMessageId);
    },

    /**
     * @param {string} chatMessageId
     */
    removeChatMessageId: function(chatMessageId) {
        var chatMessageIdSet = this.getChatMessageIdSet();
        if (!chatMessageIdSet) {
            chatMessageIdSet = new Set();
            this.setChatMessageIdSet(chatMessageIdSet);
        }
        chatMessageIdSet.remove(chatMessageId);
    },

    /**
     * @param {ChatMessage} chatMessage
     */
    addChatMessage: function(chatMessage) {
        if (chatMessage.getId()) {
            this.chatMessageSet.add(chatMessage);
            this.addChatMessageId(chatMessage.getId());
        } else {
            throw new Error("chatMessage must have an id before it can be added");
        }
    },

    /**
     * @return {Set.<ChatMessage>}
     */
    getChatMessageSet: function() {
        return this.chatMessageSet;
    },

    /**
     * @param {ChatMessage} chatMessage
     */
    removeChatMessage: function(chatMessage) {
        if (chatMessage.getId()) {
            this.chatMessageSet.remove(chatMessage);
            this.removeChatMessageId(chatMessage.getId());
        } else {
            throw new Error("chatMessage must have an id before it can be removed");
        }
    },

    /**
     * @return {(Dialogue | Room)}
     */
    getOwner: function() {
        return this.owner;
    },

    /**
     * @param {(Dialogue | Room)} owner
     */
    setOwner: function(owner) {
        if (owner.getId()) {
            this.owner = owner;
            this.setOwnerId(owner.getId());
        } else {
            throw new Error("owner must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Conversation).with(
    entity("Conversation").properties([
        property("chatMessageIdSet")
            .type("Set")
            .collectionOf("string"),
        property("chatMessageSet")
            .type("Set")
            .collectionOf("ChatMessage")
            .populates(true),
        property("createdAt")
            .type("date"),
        property("ownerId")
            .type("string"),
        property("owner")
            .type("Room")
            .populates(true),
        property("updatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Conversation', Conversation);
