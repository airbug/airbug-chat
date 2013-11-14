//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Session')

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

var Session = Class.extend(Entity, {

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
         * @type {Cookie}
         */
        this.cookie = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Cookie}
     */
    getCookie: function() {
        return this.cookie;
    },

    /**
     * @param {Cookie} cookie
     */
    setCookie: function(cookie) {
        this.cookie = cookie;
    },

    /**
     * @return {Object}
     */
    getData: function() {
        return this.deltaDocument.getData().data;
    },

    /**
     * @param {Object} data
     */
    setData: function(data) {
        this.deltaDocument.getData().data = data;
    },

    /**
     * @return {Date}
     */
    getExpires: function() {
        return this.getCookie().getExpires();
    },

    /**
     * @return {string}
     */
    getSid: function() {
        return this.deltaDocument.getData().sid;
    },

    /**
     * @param {string} sid
     */
    setSid: function(sid) {
        this.deltaDocument.getData().sid = sid;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.deltaDocument.getData().userId;
    },

    /**
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaDocument.getData().userId = userId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    resetMaxAge: function() {
        this.cookie.resetMaxAge();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Session).with(
    entity("Session").properties([
        property("cookie")
            .type("Cookie"),
        property("createdAt")
            .type("date"),
        property("data")
            .type("string"),
        property("id")
            .type("string")
            .primaryId(),
        property("sid")
            .type("string"),
        property("updatedAt")
            .type("date"),
        property("userId")
            .type("string")
            .id()
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
