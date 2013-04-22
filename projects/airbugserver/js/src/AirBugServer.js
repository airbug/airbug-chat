//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirBugServer')

//@Require('bugfs.BugFs')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var express = require("express");
var fs = require("fs");
var http = require('http');
var mongoose = require('mongoose');
var mu2Express = require("mu2express");
var path = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugFs = bugpack.require('bugfs.BugFs');

//var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var AirBugServer = {

    start: function() {

        var app = express();
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

        app.configure(function(){
            app.engine('mustache', mu2Express.engine);
            app.set('view engine', 'mustache');
            app.set('views', path.resolve(__dirname, '../resources/views'));

            app.set('port', config.port);

            /*app.set('view engine', 'jade');*/

            app.use(express.favicon(path.resolve(__dirname, '../static/img/airbug-icon.png')));
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.methodOverride()); // put and delete support for html 4 and older
            app.use(express.static(path.resolve(__dirname, '../static')));
            app.use(app.router);
        });

        app.configure('development', function(){
            app.use(express.errorHandler());
        });


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


        // Routes
        //-------------------------------------------------------------------------------

        app.get('/alpha', function(req, res){
            res.render('alpha', {
                title: 'airbug',
                production: config.production
            });
        });


        // Shut Down
        //-------------------------------------------------------------------------------

        // Graceful Shutdown
        process.on('SIGTERM', function () {
            console.log("Server Closing");
            app.close();
        });

        app.on('close', function () {
            console.log("Server Closed");
            db.connection.close();
        });

        // Create Server
        http.createServer(app).listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.AirBugServer', AirBugServer);
