//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirBugServer')

//@Require('bugfs.BugFs')
//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('airbugserver.ExpressServer')
//@Require('airbugserver.SocketManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var connect     = require('connect');
// var cookie      = require('cookie');
var express     = require("express");
var fs          = require("fs");
var http        = require('http');
var mongoose    = require('mongoose');
var mu2Express  = require("mu2Express");
var path        = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugFs           = bugpack.require('bugfs.BugFs');
var Class           = bugpack.require('Class');
var ExpressServer   = bugpack.require('airbugserver.ExpressServer');
var Obj             = bugpack.require('Obj');
var SocketManager   = bugpack.require('airbugserver.SocketManager');

//var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var AirBugServer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(){

        this._super();

        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /*
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         **/
        this.config         = null;

        /*
         * @type {ExpressServer}
         **/
        this.expressServer  = null;

        /*
         * @type {Mongoose}
         **/
        this.mongoose       = null;

        /*
         * @type {SocketManager}
         **/
        this.socketManager  = null;

    },

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     **/
    start: function() {

        var config          = this.config;
        var expressServer   = this.expressServer.start();
        var mongoose        = this.mongoose;
        var socketManager   = this.socketManager.initialize(expressServer);
        var cookieParser    = expressServer.getCookieParser();
        var sessionStore    = expressServer.getSessionStore();
        var sessionKey      = expressServer.getSessionKey();

        //-------------------------------------------------------------------------------
        // Connect to MongoDB
        //-------------------------------------------------------------------------------

        mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

        //-------------------------------------------------------------------------------
        // Enable Sockets
        //-------------------------------------------------------------------------------

        socketManager.enablesockets(cookieParser, sessionStore, sessionKey);

        //-------------------------------------------------------------------------------
        // 
        //-------------------------------------------------------------------------------

        //var clientJSServer = new ClientJSServer(app);


        //TODO BRN: These lines are temporary until we get the client js server working


        //TODO BRN: Uncomment this once we get the client js server working

        /*clientJSServer.initializeServer(function(error) {
            if (!error) {
                app.configure(function() {
                    app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
                    app.use(express.logger('dev'));
                    app.use(app.router);
                });

                app.listen(port);

                console.log("Express server running on port " + port);
            } else {
                throw error;
            }
        });*/
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AirBugServer', AirBugServer);
