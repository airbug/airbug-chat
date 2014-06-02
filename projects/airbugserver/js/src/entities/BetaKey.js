//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.BetaKey')

//@Require('Class')
//@Require('Set')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
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
var EntityTag        = bugpack.require('bugentity.EntityTag');
var PropertyTag      = bugpack.require('bugentity.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityTag.entity;
var property                = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaKey = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      betaKey: string,
     *      count: number,
     *      createdAt: Date,
     *      id: string,
     *      isBaseKey: boolean,
     *      updatedAt: Date
     * }} data
     */
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
     * @return {string}
     */
    getBaseKey: function() {
        return this.getEntityData().baseKey;
    },

    /**
     * @param {string} baseKey
     */
    setBaseKey: function(baseKey) {
        this.getEntityData().baseKey = baseKey;
    },

    /**
     * @return {string}
     */
    getBetaKey: function() {
        return this.getEntityData().betaKey;
    },

    /**
     * @param {string} betaKey
     */
    setBetaKey: function(betaKey) {
        this.getEntityData().betaKey = betaKey;
    },

    /**
     * @return {number}
     */
    getCap: function() {
        return this.getEntityData().cap;
    },

    /**
     * @param {string} cap
     */
    setCap: function(cap) {
        this.getEntityData().cap = cap;
    },

    /**
     * @return {number}
     */
    getCount: function() {
        return this.getEntityData().count;
    },

    /**
     * @param {string} count
     */
    setCount: function(count) {
        this.getEntityData().count = count;
    },

    /**
     * @return {boolean}
     */
    getHasCap: function() {
        return this.getEntityData().hasCap;
    },

    /**
     * @param {boolean} hasCap
     */
    setHasCap: function(hasCap) {
        return this.getEntityData().hasCap = hasCap;
    },

    /**
     * @return {boolean}
     */
    getIsBaseKey: function() {
        return this.getEntityData().isBaseKey;
    },

    /**
     * @param {boolean} isBaseKey
     */
    setIsBaseKey: function(isBaseKey) {
        return this.getEntityData().isBaseKey = isBaseKey;
    },

    /**
     * @return {Array.<string>}
     */
    getSecondaryKeys: function() {
        return this.getEntityData().secondaryKeys;
    },

    /**
     * @param {Array.<string>} secondaryKeys
     */
    setSecondaryKeys: function(secondaryKeys) {
        return this.getEntityData().secondaryKeys = secondaryKeys;
    },

    /**
     * @return {string}
     */
    getVersion: function() {
        return this.getEntityData().version;
    },

    /**
     * @param {string} version
     */
    setVersion: function(version) {
        return this.getEntityData().version = version;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(BetaKey).with(
    entity("BetaKey").properties([
        property("baseKey")
            .type("string")
            .require(true)
            .index(true),
        property("betaKey")
            .type("string")
            .require(true)
            .index(true)
            .unique(true),
        property("cap")
            .type("number"),
        property("count")
            .type("number")
            .require(true)
            .default(0),
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("hasCap")
            .type("boolean")
            .require(true)
            .default(false),
        property("id")
            .type("string")
            .primaryId(),
        property("isBaseKey")
            .type("boolean")
            .index(true)
            .require(true)
            .default(false),
        property("secondaryKeys")
            .type("array")
            .collectionOf("string"),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("version")
            .type("string")
            .require(true)
            .default("0.0.1")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKey', BetaKey);
