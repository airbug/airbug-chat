//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressApp')

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
var SocketManager   = bugpack.require('airbugserver.SocketManager');

//var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressApp = Class.extend(Obj, {

    _constructor: function(){

        this.super();
        
        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        this.app            = null;

        this.secret         = null;

        this.sessionKey     = null;

        this.cookieParser   = null;

        this.sessionStore   = null;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @return {ExpressApp}
     **/
    initialize: function(){

        /*
         * @type {}
         **/
        var app             = this.app              = express();

        /*
         * @type {string}
         **/
        var secret          = this.secret           = 'some secret'; // LOAD FROM CONFIG

        /*
         * @type {string}
         **/
        var sessionKey      = this.sessionKey       = 'express.sid';

        /*
         * @type {}
         **/
        var cookieParser    = this.cookieParser     = express.cookieParser(secret);

        /*
         * @type {MemoryStore}
         **/
        var sessionStore    = this.sessionStore     = new connect.middleware.session.MemoryStore();

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

        mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

        // Configure App
        //-------------------------------------------------------------------------------
        this.configure(app);

        // Routes
        //-------------------------------------------------------------------------------
        this.enableRoutes(app);

        // Graceful Shut Down
        //-------------------------------------------------------------------------------
        this.enableGracefulShutdown(app);

    },


    //-------------------------------------------------------------------------------
    //  Getters and Setters
    //-------------------------------------------------------------------------------

    /*
     * @return {}
     **/
    getCookieParser: function(){
        return this.getCookieParser;
    },

    /*
     * @return {}
     **/
    getSessionStore: function(){
        return this.getSessionStore;
    },


    /*
     * @return {}
     **/
    getSessionKey: function(){
        return this.getSessionKey;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {} app
     **/
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


    /*
     * @private
     * @param {} app
     **/
    enableRoutes: function(app){

    },

    /*
     * @private
     * @param {} app
     **/
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