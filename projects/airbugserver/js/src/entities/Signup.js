//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Signup')

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
var Signup = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      acceptedLanguages: string,
     *      airbugVersion: string,
     *      baseBetaKey: string,
     *      betaKey: string,
     *      city: string,
     *      country: string,
     *      createdAt: Date,
     *      day: number,
     *      geoCoordinates: Array.<number>,
     *      ipAddress: string,
     *      languages: Array.<string>,
     *      month: number,
     *      secondaryBetaKeys: Array.<string>,
     *      state: string,
     *      updatedAt: Date,
     *      userAgent: string,
     *      userId: string,
     *      version: string,
     *      weekday: number,
     *      year: number
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
    getAcceptedLanguages: function() {
        return this.getEntityData().acceptedLanguages;
    },

    /**
     * @param {string} acceptedLanguages
     */
    setAcceptedLanguages: function(acceptedLanguages) {
        this.getEntityData().acceptedLanguages = acceptedLanguages;
    },

    /**
     * @return {string}
     */
    getAirbugVersion: function() {
        return this.getEntityData().airbugVersion;
    },

    /**
     * @return {string}
     */
    getBaseBetaKey: function() {
        return this.getEntityData().baseBetaKey;
    },

    /**
     * @return {string}
     */
    getBetaKey: function() {
        return this.getEntityData().betaKey;
    },

    /**
     * @return {string}
     */
    getCity: function() {
        return this.getEntityData().city;
    },

    /**
     * @return {string}
     */
    getCountry: function() {
        return this.getEntityData().country;
    },

    /**
     * @return {number}
     */
    getDay: function() {
        return this.getEntityData().day;
    },

    /**
     * @return {Array.<number>}
     */
    getGeoCoordinates: function() {
        return this.getEntityData().geoCoordinates;
    },

    /**
     * @return {string}
     */
    getIpAddress: function() {
        return this.getEntityData().ipAddress;
    },

    /**
     * @return {Array.<string>}
     */
    getLanguages: function() {
        return this.getEntityData().languages;
    },

    /**
     * @return {number}
     */
    getMonth: function() {
        return this.getEntityData().month;
    },

    /**
     * @return {Array.<string>}
     */
    getSecondaryBetaKeys: function() {
        return this.getEntityData().secondaryBetaKeys;
    },

    /**
     * @return {string}
     */
    getState: function() {
        return this.getEntityData().state;
    },

    /**
     * @return {string}
     */
    getUserAgent: function() {
        return this.getEntityData().userAgent;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.getEntityData().userId;
    },

    /**
     * @return {string}
     */
    getVersion: function() {
        return this.getEntityData().version;
    },

    /**
     * @return {number}
     */
    getWeekday: function() {
        return this.getEntityData().weekday;
    },

    /**
     * @return {number}
     */
    getYear: function() {
        return this.getEntityData().year;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(Signup).with(
    entity("Signup").properties([
        property("acceptedLanguages")
            .type("string"),
        property("airbugVersion")
            .type("string")
            .index(true)
            .require(true),
        property("baseBetaKey")
            .type("string")
            .index(true),
        property("betaKey")
            .type("string")
            .index(true)
            .require(true),
        property("city")
            .type("string")
            .index(true),
        property("country")
            .type("string")
            .index(true),
        property("createdAt")
            .type("date")
            .index(true)
            .require(true)
            .default(Date.now),
        property("day")
            .type("number")
            .index(true),
        property("geoCoordinates")
            .type("Set")
            .collectionOf("number")
            .index(true),
        property("id")
            .type("string")
            .primaryId(),
        property("ipAddress")
            .type("string"),
        property("languages")
            .type("Set")
            .collectionOf("string")
            .index(true),
        property("month")
            .type("number")
            .index(true),
        property("secondaryBetaKeys")
            .type("Set")
            .collectionOf("string")
            .index(true),
        property("state")
            .type("string")
            .index(true),
        property("updatedAt")
            .type("date")
            .index(true)
            .require(true)
            .default(Date.now),
        property("userAgent")
            .type("string")
            .index(true),
        property("userId")
            .type("string")
            .index(true)
            .id(),
        property("version")
            .type("string")
            .index(true)
            .require(true)
            .default("0.1.0"),
        property("weekday")
            .type("number")
            .index(true),
        property("year")
            .type("number")
            .index(true)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Signup', Signup);
