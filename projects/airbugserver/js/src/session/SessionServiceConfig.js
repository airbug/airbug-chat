//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionServiceConfig')

//@Require('Class')
//@Require('Config')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Config      = bugpack.require('Config');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Config}
 */
var SessionServiceConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCookieMaxAge: function() {
        return this.getProperties().getProperty("cookieMaxAge");
    },

    /**
     * @param {number} cookieMaxAge
     */
    setCookieMaxAge: function(cookieMaxAge) {
        this.getProperties().setProperty("cookieMaxAge", cookieMaxAge);
    },

    /**
     * @return {string}
     */
    getCookiePath: function() {
        var cookiePath = this.getProperties().getProperty("cookiePath");
        if (!TypeUtil.isString(cookiePath)) {
            cookiePath = "/";
        }
        return cookiePath;
    },

    /**
     * @param {string} cookiePath
     */
    setCookiePath: function(cookiePath) {
        this.getProperties().setProperty("cookiePath", cookiePath);
    },

    /**
     * @return {string}
     */
    getCookieSecret: function() {
        return this.getProperties().getProperty("cookieSecret");
    },

    /**
     * @param {string} cookieSecret
     */
    setCookieSecret: function(cookieSecret) {
        this.getProperties().setProperty("cookieSecret", cookieSecret);
    },

    /**
     * @return {boolean}
     */
    getRollingSessions: function() {
        var rollingSessions = this.getProperties().getProperty("rollingSessions");
        if (!TypeUtil.isBoolean(rollingSessions)) {
            rollingSessions = false;
        }
        return rollingSessions;
    },

    /**
     * @param {boolean} rollingSessions
     */
    setRollingSessions: function(rollingSessions) {
        this.getProperties().setProperty("rollingSessions", rollingSessions);
    },

    /**
     * @return {string}
     */
    getSessionKey: function() {
        var sessionKey = this.getProperties().getProperty("sessionKey");
        if (!TypeUtil.isString(sessionKey)) {
            sessionKey = "airbug.sid";
        }
        return sessionKey;
    },

    /**
     * @param {string} sessionKey
     */
    setSessionKey: function(sessionKey) {
        this.getProperties().setProperty("sessionKey", sessionKey);
    },

    /**
     * @return {boolean}
     */
    getTrustProxy: function() {
        var trustProxy = this.getProperties().getProperty("trustProxy");
        if (!TypeUtil.isBoolean(trustProxy)) {
            trustProxy = false;
        }
        return trustProxy;
    },

    /**
     * @param {boolean} trustProxy
     */
    setTrustProxy: function(trustProxy) {
        this.getProperties().setProperty("trustProxy", trustProxy);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.SessionServiceConfig", SessionServiceConfig);
