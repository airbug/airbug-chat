//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var Obj = require('./Obj');
var TypeUtil = require('./TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Server = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {
        this._super();

        this.started = false;

        this.port = 8080;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    start: function(port) {
        if (!this.started) {
            if (TypeUtil.isNumber(port) && port > 0) {
                this.port = port;
            }
            this.startServer();
            this.started = true;
        }
    },

    startServer: function() {
        // Override this function.
    },

    stop: function() {
        if (this.started) {
            this.stopServer();
            this.started = false;
        }
    },

    stopServer: function() {
        // Override this function.
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Server;
