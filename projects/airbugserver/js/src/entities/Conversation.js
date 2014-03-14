//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Conversation')
//@Autoload

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

/**
 * @class
 * @extends {Entity}
 */
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
     * @return {string}
     */
    getOwnerId: function() {
        return this.getEntityData().ownerId;
    },

    /**
     * @param {string} ownerId
     */
    setOwnerId: function(ownerId) {
        this.getEntityData().ownerId = ownerId;
    },

    /**
     * @return {string}
     */
    getOwnerType: function() {
        return this.getEntityData().ownerType;
    },

    /**
     * @param {string} ownerType
     */
    setOwnerType: function(ownerType) {
        this.getEntityData().ownerType = ownerType;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<ChatMessage>}
     */
    getChatMessageSet: function() {
        return this.chatMessageSet;
    },

    /**
     * @param {Set.<ChatMessage>} chatMessageSet
     */
    setChatMessageSet: function(chatMessageSet) {
        this.chatMessageSet = chatMessageSet;
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
        property("chatMessageSet")
            .type("Set")
            .collectionOf("ChatMessage")
            .populates(true)
            .store(false),
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("id")
            .type("string")
            .primaryId(),
        property("ownerId")
            .type("string")
            .require(true)
            .index(true)
            .unique(true)
            .id(),
        property("ownerType")
            .type("string")
            .require(true),
        property("owner")
            .populates(true)
            .store(false),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Conversation', Conversation);
