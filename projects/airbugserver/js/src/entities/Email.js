//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Email')
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
var Email = Class.extend(Entity, {

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
         * @type {Set.<UserEmail>}
         */
        this.userEmailSet   = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getBounced: function() {
        return this.getEntityData().bounced;
    },

    /**
     * @param {boolean} bounced
     */
    setBounced: function(bounced) {
        this.getEntityData().bounced = bounced;
    },

    /**
     * @return {Date}
     */
    getBouncedAt: function() {
        return this.getEntityData().bouncedAt;
    },

    /**
     * @param {Date} bouncedAt
     */
    setBouncedAt: function(bouncedAt) {
        this.getEntityData().bouncedAt = bouncedAt;
    },

    /**
     * @return {boolean}
     */
    getComplained: function() {
        return this.getEntityData().complained;
    },

    /**
     * @param {boolean} complained
     */
    setComplained: function(complained) {
        this.getEntityData().complained = complained;
    },

    /**
     * @return {Date}
     */
    getComplainedAt: function() {
        return this.getEntityData().complainedAt;
    },

    /**
     * @param {Date} complainedAt
     */
    setComplainedAt: function(complainedAt) {
        this.getEntityData().complainedAt = complainedAt;
    },

    /**
     * @return {string}
     */
    getEmail: function() {
        return this.getEntityData().string;
    },

    /**
     * @param {string} email
     */
    setEmail: function(email) {
        this.getEntityData().email = email;
    },

    /**
     * @return {Set.<Email>}
     */
    getUserEmailSet: function() {
        return this.userEmailSet;
    },

    /**
     * @param {ISet.<UserEmail>} userEmailSet
     */
    setUserEmailSet: function(userEmailSet) {
        this.userEmailSet = userEmailSet;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Email).with(
    entity("Email").properties([
        property("bounced")
            .type("boolean")
            .require(true)
            .default(false),
        property("bouncedAt")
            .type("date"),
        property("complained")
            .type("boolean")
            .require(true)
            .default(false),
        property("complainedAt")
            .type("date"),
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("email")
            .type("string")
            .unique(true)
            .require(true)
            .index(true),
        property("id")
            .type("string")
            .primaryId(),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("userEmailSet")
            .type("Set")
            .collectionOf("UserEmail")
            .populates(true)
            .store(false)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Email', Email);
