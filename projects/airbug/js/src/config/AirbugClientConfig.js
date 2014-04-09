//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.AirbugClientConfig')

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
var AirbugClientConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getEnableTracking: function() {
        return this.getProperty("enableTracking");
    },

    /**
     * @param {boolean} enableTracking
     */
    setEnableTracking: function(enableTracking) {
        this.setProperty("enableTracking", enableTracking);
    },

    /**
     * @returns {string}
     */
    getGithubClientId: function() {
        return this.getProperty("github.clientId");
    },

    /**
     * @param {string} clientId
     */
    setGithubClientId: function(clientId) {
        this.setProperty("github.clientId", clientId);
    },

    /**
     * @returns {*}
     */
    getGithubEmails: function() {
        return this.getProperty("github.emails");
    },

    /**
     * @param {array} emails
     */
    setGithubEmails: function(emails) {
        this.setProperty('github.emails', emails);
    },

    /**
     * @returns {string}
     */
    getGithubScope: function() {
        return this.getProperty("github.scope");
    },

    /**
     * @param {string} scope
     */
    setGithubScope: function(scope) {
        this.setProperty("github.scope", scope);
    },

    /**
     * @returns {string}
     */
    getGithubState: function() {
        return this.getProperty("github.state");
    },

    /**
     * @param {string} state
     */
    setGithubState: function(state) {
        this.setProperty("github.state", state);
    },

    /**
     * @return {string}
     */
    getGoogleAnalyticsId: function() {
        return this.getProperty("googleAnalyticsId");
    },

    /**
     * @param {string} googleAnalyticsId
     */
    setGoogleAnalyticsId: function(googleAnalyticsId) {
        this.setProperty("googleAnalyticsId", googleAnalyticsId);
    },

    /**
     * @return {string}
     */
    getStaticUrl: function() {
        return this.getProperty("staticUrl");
    },

    /**
     * @param {string} staticUrl
     */
    setStaticUrl: function(staticUrl) {
        this.setProperty("staticUrl", staticUrl);
    },

    /**
     * @return {string}
     */
    getStickyStaticUrl: function() {
        return this.getProperty("stickyStaticUrl");
    },

    /**
     * @param {string} stickyStaticUrl
     */
    setStickyStaticUrl: function(stickyStaticUrl) {
        this.setProperty("stickyStaticUrl", stickyStaticUrl);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfig", AirbugClientConfig);
