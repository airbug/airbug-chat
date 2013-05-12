//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirBugServer')

//@Require('bugfs.BugFs')
//@Require('Map')
//@Require('airbugserver.ExpressServer')
//@Require('airbugserver.SocketManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var connect     = require('connect');
var cookie      = require('cookie');
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
// var Map             = bugpack.require('Map');
var ExpressServer   = bugpack.require('airbugserver.ExpressServer');
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

        this.super();

        /*
         * @type {ExpressServer}
         **/
        this.expressServer = null;

        /*
         * @type {SocketManager}
         **/
        this.socketManager = null;

    }

    start: function() {

        var expressServer   = this.expressServer.start();
        var socketManager   = this.socketManager.initialize(expressServer);
        var cookieParser    = expressServer.cookieParser;
        var sessionStore    = expressServer.sessionStore;
        var sessionKey      = expressServer.sessionKey;
        
        socketManager.enablesockets(cookieParser, sessionStore, sessionKey);
        
        var configPath = path.resolve(__dirname, '../config.json');
        var config = {
            port: 8000,
            mongoDbIp: "localhost"
        };

        if (BugFs.existsSync(configPath)) {
            config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
        }

        mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

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

bugpack.export('airbug.AirBugServer', AirBugServer);
