//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.SessionServiceConfig')

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
        var cookieMaxAge = this.getProperty("cookieMaxAge");
        if (!TypeUtil.isNumber(cookieMaxAge)) {
            cookieMaxAge = 86400000;
        }
        return cookieMaxAge;
    },

    /**
     * @param {number} cookieMaxAge
     */
    setCookieMaxAge: function(cookieMaxAge) {
        this.setProperty("cookieMaxAge", cookieMaxAge);
    },

    /**
     * @return {string}
     */
    getCookiePath: function() {
        var cookiePath = this.getProperty("cookiePath");
        if (!TypeUtil.isString(cookiePath)) {
            cookiePath = "/";
        }
        return cookiePath;
    },

    /**
     * @param {string} cookiePath
     */
    setCookiePath: function(cookiePath) {
        this.setProperty("cookiePath", cookiePath);
    },

    /**
     * @return {string}
     */
    getCookieSecret: function() {
        var cookieSecret = this.getProperty("cookieSecret");
        if (!TypeUtil.isString(cookieSecret)) {
            cookieSecret = "";
        }
        return cookieSecret;
    },

    /**
     * @param {string} cookieSecret
     */
    setCookieSecret: function(cookieSecret) {
        this.setProperty("cookieSecret", cookieSecret);
    },

    /**
     * @returns {string}
     */
    getCookieDomain: function() {
        var cookieDomain = this.getProperty("cookieDomain");
        if (!TypeUtil.isString(cookieDomain)) {
            cookieDomain = "";
        }
        return cookieDomain;
    },

    /**
     * @param {string} cookieDomain
     */
    setCookieDomain: function(cookieDomain) {
        this.setProperty("cookieDomain", cookieDomain);
    },

    /**
     * @return {boolean}
     */
    getRollingSessions: function() {
        var rollingSessions = this.getProperty("rollingSessions");
        if (!TypeUtil.isBoolean(rollingSessions)) {
            rollingSessions = false;
        }
        return rollingSessions;
    },

    /**
     * @param {boolean} rollingSessions
     */
    setRollingSessions: function(rollingSessions) {
        this.setProperty("rollingSessions", rollingSessions);
    },

    /**
     * @return {string}
     */
    getSessionKey: function() {
        var sessionKey = this.getProperty("sessionKey");
        if (!TypeUtil.isString(sessionKey)) {
            sessionKey = "airbug.sid";
        }
        return sessionKey;
    },

    /**
     * @param {string} sessionKey
     */
    setSessionKey: function(sessionKey) {
        this.setProperty("sessionKey", sessionKey);
    },

    /**
     * @return {boolean}
     */
    getTrustProxy: function() {
        var trustProxy = this.getProperty("trustProxy");
        if (!TypeUtil.isBoolean(trustProxy)) {
            trustProxy = false;
        }
        return trustProxy;
    },

    /**
     * @param {boolean} trustProxy
     */
    setTrustProxy: function(trustProxy) {
        this.setProperty("trustProxy", trustProxy);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.SessionServiceConfig", SessionServiceConfig);
