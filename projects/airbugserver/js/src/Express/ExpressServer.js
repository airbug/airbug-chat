//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ExpressServer')

//@Require('bugfs.BugFs')
//@Require('Map')


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
var SocketManager   = bugpack.require('airbugserver.SocketManager');

//var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var ExpressServer = Class.extend(Obj, {

    _constructor: function(){

        this.super();

        this.app = null;

        this.secret = null;

        this.sessionKey = null;

        this.cookieParser = null;

        this.sessionStore = null;
    },

    initialize: function(){

        var app = this.app = express();

        var secret = this.secret = 'some secret'; // LOAD FROM CONFIG

        var sessionKey = this.sessionKey = 'express.sid';

        var cookieParser = this.cookieParser = express.cookieParser(secret);

        var sessionStore = this.sessionStore = new connect.middleware.session.MemoryStore();
        
        return this;
    },

    start: function() {

        var app = this.app;
        var configPath = path.resolve(__dirname, '../config.json');
        var config = {
            port: 8000,
            mongoDbIp: "localhost"
        };
        var secret = 'some secret'; 
        var sessionKey = 'express.sid';
        var cookieParser = express.cookieParser(secret);
        var sessionStore = new connect.middleware.session.MemoryStore();
        
        if (BugFs.existsSync(configPath)) {
            config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
        }

        // mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

        // Configure App
        //-------------------------------------------------------------------------------
        this.configure(app);

        // Routes
        //-------------------------------------------------------------------------------
        this.enableRoutes(app);

        // Graceful Shut Down
        //-------------------------------------------------------------------------------
        this.enableGracefulShutdown(app);
        
        // Create Server
        //-------------------------------------------------------------------------------
        return http.createServer(app).listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });
        
    },

    configure: function(app){
        app.configure(function(){
            app.engine('mustache', mu2Express.engine);
            app.set('view engine', 'mustache');
            app.set('views', path.resolve(__dirname, '../resources/views'));

            app.set('port', config.port);

            /*app.set('view engine', 'jade');*/

            app.use(cookieParser);
            app.use(express.session({secret: secret, key: sessionKey}));
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
    },

    enableRoutes: function(app){
        app.get('/alpha', function(req, res){
            res.render('alpha', {
                title: 'airbug',
                production: config.production
            });
        });
    },

    enableGracefulShutdown: function(app){
        process.on('SIGTERM', function () {
            console.log("Server Closing");
            app.close();
        });

        app.on('close', function () {
            console.log("Server Closed");
            db.connection.close();
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressServer', ExpressServer);
