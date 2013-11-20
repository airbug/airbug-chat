//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugClientConfig", AirbugClientConfig);
