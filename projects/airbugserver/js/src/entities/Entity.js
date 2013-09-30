//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Entity')

//@Require('Class')
//@Require('IObjectable')
//@Require('LiteralUtil')
//@Require('Obj')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.IDelta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IObjectable     = bugpack.require('IObjectable');
var LiteralUtil     = bugpack.require('LiteralUtil');
var Obj             = bugpack.require('Obj');
var DeltaDocument   = bugpack.require('bugdelta.DeltaDocument');
var IDelta          = bugpack.require('bugdelta.IDelta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Entity = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeltaDocument}
         */
        this.deltaDocument        = new DeltaDocument(data);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Date}
     */
    getCreatedAt: function() {
        return this.deltaDocument.getCurrentData().createdAt;
    },

    /**
     * @param {Date} createdAt
     */
    setCreatedAt: function(createdAt) {
        this.deltaDocument.getCurrentData().createdAt = createdAt;
    },

    /**
     * @return {string}
     */
    getId: function() {
        return this.deltaDocument.getCurrentData().id;
    },

    /**
     * @param {string} id
     */
    setId: function(id) {
        this.deltaDocument.getCurrentData().id = id;
    },

    /**
     * @return {Date}
     */
    getUpdatedAt: function() {
        return this.deltaDocument.getCurrentData().updatedAt;
    },

    /**
     * @param {Date} updatedAt
     */
    setUpdatedAt: function(updatedAt) {
        this.deltaDocument.getCurrentData().updatedAt = updatedAt;
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Entity)) {
            return (Obj.equals(value.getId(), this.getId()));
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[BugJar]" + Obj.hashCode(this.getId()));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IDelta Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitDelta: function() {
        this.deltaDocument.commitDelta();
    },

    /**
     * @return {List.<DeltaChange>}
     */
    generateDelta: function() {
        return this.deltaDocument.generateDelta();
    },
    
    
    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return LiteralUtil.convertToLiteral(this.deltaDocument.getCurrentData());
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Entity, IDelta);
Class.implement(Entity, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Entity', Entity);
