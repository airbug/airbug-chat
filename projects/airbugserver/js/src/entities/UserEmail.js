//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserEmail')
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
var UserEmail = Class.extend(Entity, {

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
         * @type {Email}
         */
        this.email          = null;

        /**
         * @private
         * @type {User}
         */
        this.user           = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getEmailId: function() {
        return this.getEntityData().emailId;
    },

    /**
     * @param {string} emailId
     */
    setEmailId: function(emailId) {
        this.getEntityData().emailId = emailId;
    },

    /**
     * @return {boolean}
     */
    getPrimary: function() {
        return this.getEntityData().primary;
    },

    /**
     * @param {boolean} primary
     */
    setPrimary: function(primary) {
        this.getEntityData().primary = primary;
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

    /**
     * @return {boolean}
     */
    getValidated: function() {
        return this.getEntityData().validated;
    },

    /**
     * @param {boolean} validated
     */
    setValidated: function(validated) {
        this.getEntityData().validated = validated;
    },

    /**
     * @return {Date}
     */
    getValidatedAt: function() {
        return this.getEntityData().validatedAt;
    },

    /**
     * @param {Date} validatedAt
     */
    setValidatedAt: function(validatedAt) {
        this.getEntityData().validatedAt = validatedAt;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Email}
     */
    getEmail: function() {
        return this.email;
    },

    /**
     * @param {Email} email
     */
    setEmail: function(email) {
        this.email = email;
        this.setEmailId(email.getId());
    },

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
        this.user = user;
        this.setUserId(user.getId());
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserEmail).with(
    entity("UserEmail").properties([
        property("email")
            .type("Email")
            .populates(true)
            .store(false),
        property("emailId")
            .type("string")
            .require(true)
            .index(true)
            .id(),
        property("id")
            .type("string")
            .primaryId(),
        property("primary")
            .type("boolean")
            .require(true)
            .default(false),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("user")
            .type("User")
            .populates(true)
            .store(false),
        property("userId")
            .type("string")
            .require(true)
            .index(true)
            .id(),
        property("validated")
            .type("boolean")
            .require(true)
            .default(false),
        property("validatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserEmail', UserEmail);
