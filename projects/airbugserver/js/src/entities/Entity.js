//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Entity')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')
//@Require('bugdelta.DeltaObject')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');
var DeltaObject     = bugpack.require('bugdelta.DeltaObject');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Entity = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeltaObject}
         */
        this.deltaObject        = new DeltaObject();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Date}
     */
    getCreatedAt: function() {
        return this.deltaObject.getProperty("createdAt");
    },

    /**
     * @param {Date} createdAt
     */
    setCreatedAt: function(createdAt) {
        this.deltaObject.setProperty("createdAt", createdAt);
    },

    /**
     * @return {DeltaObject}
     */
    getDeltaObject: function() {
        return this.deltaObject;
    },

    /**
     * @param {DeltaObject} deltaObject
     */
    setDeltaObject: function(deltaObject) {
        this.deltaObject = deltaObject;
    },

    /**
     * @return {string}
     */
    getId: function() {
        return this.deltaObject.getProperty("id");
    },

    /**
     * @param {string} id
     */
    setId: function(id) {
        this.deltaObject.setProperty("id", id);
    },

    /**
     * @return {Date}
     */
    getUpdatedAt: function() {
        return this.deltaObject.getProperty("updatedAt");
    },

    /**
     * @param {Date} updatedAt
     */
    setUpdatedAt: function(updatedAt) {
        this.deltaObject.setProperty("updatedAt", updatedAt);
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return this.deltaObject.toObject();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitProperties: function() {
        this.deltaObject.commitChanges();
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Entity, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Entity', Entity);
