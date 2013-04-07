//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirBugServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var express = require("express");
var fs = require("fs");
var mu2Express = require("mu2Express");


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var AirBugServer = {

    start: function() {

        var app = express();
        var port = 8000;
        var clientJSServer = new ClientJSServer(app);

        app.set('view engine', 'mustache');
        app.engine('mustache', mu2Express.engine);
        clientJSServer.initializeServer(function(error) {
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
        });
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.AirBugServer', AirBugServer);
