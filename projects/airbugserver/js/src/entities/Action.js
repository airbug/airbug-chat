//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Action')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.IndexAnnotation')
//@Require('bugentity.PropertyAnnotation')
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
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var IndexAnnotation         = bugpack.require('bugentity.IndexAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var index                   = IndexAnnotation.index;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
var Action = Class.extend(Entity, {

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
         * @type {User}
         */
        this.user               = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getActionData: function() {
        return this.getEntityData().actionData;
    },

    /**
     * @param {string} actionData
     */
    setActionData: function(actionData) {
        this.getEntityData().actionData = actionData;
    },

    /**
     * @return {string}
     */
    getActionType: function() {
        return this.getEntityData().actionType;
    },

    /**
     * @param {string} actionType
     */
    setActionType: function(actionType) {
        this.getEntityData().actionType = actionType;
    },

    /**
     * @return {string}
     */
    getActionVersion: function() {
        return this.getEntityData().actionVersion;
    },

    /**
     * @param {string} actionVersion
     */
    setActionVersion: function(actionVersion) {
        this.getEntityData().actionVersion = actionVersion;
    },

    /**
     * @return {Date}
     */
    getOccurredAt: function() {
        return this.getEntityData().occurredAt;
    },

    /**
     * @param {Date} occurredAt
     */
    setOccurredAt: function(occurredAt) {
        this.getEntityData().occurredAt = occurredAt;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.getEntityData().userId;
    },

    /**
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.getEntityData().userId = userId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {User}
     */
    getUser: function() {
        return this.user;
    },

    /**
     * @param {User} user
     */
    setUser: function(user) {
        if (user.getId()) {
            this.user = user;
            this.setUserId(user.getId());
        } else {
            throw new Bug("IllegalState", {}, "user must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Action).with(
    entity("Action")
        .properties([
            property("actionData")
                .type("mixed"),
            property("actionType")
                .type("string")
                .require(true)
                .index(true),
            property("actionVersion")
                .type("string")
                .require(true)
                .index(true),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("userId")
                .type("string")
                .index(true)
                .require(true)
                .id(),
            property("user")
                .type("User")
                .populates(true)
                .store(false),
            property("occurredAt")
                .type("date")
                .index(true)
                .require(true),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Action', Action);
