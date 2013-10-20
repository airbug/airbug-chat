//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Session')

//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
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
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
        return this.deltaDocument.getData().expires;
    },

    /**
     * @param {Date} expires
     */
    setExpires: function(expires) {
        this.deltaDocument.getData().expires = expires;
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
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Session).with(
    entity("Session").properties([
        property("createdAt")
            .type("date"),
        property("data")
            .type("string"),
        property("expires")
            .type("date"),
        property("sid")
            .type("string"),
        property("updatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
