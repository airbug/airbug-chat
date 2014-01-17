//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugServerConfig')

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
var AirbugServerConfig = Class.extend(Config, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
     * @returns {string}
     */
    getGithubClientSecret: function() {
        return this.getProperty("github.clientSecret");
    },

    /**
     * @param {string} clientSecret
     */
    setGithubClientSecret: function(clientSecret) {
        this.setProperty("github.clientSecret", clientSecret);
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

bugpack.export("airbug.AirbugServerConfig", AirbugServerConfig);
