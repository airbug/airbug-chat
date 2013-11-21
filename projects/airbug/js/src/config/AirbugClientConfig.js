//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientConfig')

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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfig", AirbugClientConfig);
