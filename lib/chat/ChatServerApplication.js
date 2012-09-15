//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

// NOTE BRN: Simply adding the ChatHomeHandlers file causes all of the handlers to become available via the annotate
// framework.

var ChatHomeHandlers = require('./ChatHomeHandlers');
var Class = require('../Class');
var HttpServerModule = require('../HttpServerModule');
var RedisServerModule = require('../RedisServerModule');
var ServerApplication = require('../ServerApplication');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatServerApplication = Class.extend(ServerApplication, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(config) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.addModule(new HttpServerModule());
        this.addModule(new RedisServerModule(config.redisConfigFile));
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    initializeApplication: function() {
        this._super();
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ChatServerApplication;
