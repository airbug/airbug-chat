//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var child_process = require('child_process');

var Class = require('./Class');
var ProcessMonitor = require('./ProcessMonitor');
var Server = require('./Server');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RedisServer = Class.extend(Server, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(configFilePath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.configFilePath = configFilePath;

        this.child = null;

        this.processMonitor = null;
    },


    //-------------------------------------------------------------------------------
    // Server Implementation
    //-------------------------------------------------------------------------------

    startServer: function() {
        //TODO BRN: Send port number to server.
        this.child = child_process.exec("redis-server " + this.configFilePath);
        this.processMonitor = new ProcessMonitor(this.child);

        //NOTE BRN: Start the monitor immediately so that we don't miss any of the data being streamed.

        this.processMonitor.start();
    },

    stopServer: function() {
        this.child.kill();
        this.processMonitor.stop();
        this.processMonitor = null;
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = RedisServer;
