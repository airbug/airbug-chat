//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressApp')

//@Require('Class')
//@Require('Obj')
//@Require('Map')
//@Require('bugfs.BugFs')
//@Require('airbugserver.SocketManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();
var connect         = require('connect');
// var cookie          = require('cookie');
var express         = require("express");
var fs              = require("fs");
var http            = require('http');
var mongoose        = require('mongoose');
var mu2Express      = require("mu2Express");
var path            = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugFs           = bugpack.require('bugfs.BugFs');
var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var SocketManager   = bugpack.require('airbugserver.SocketManager');

//var ClientJSServer = bugpack.require('clientjs.ClientJSServer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressApp = Class.extend(Obj, {

    _constructor: function(config){
        console.log("config:", config);
        this._super();
        
        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /*
         * @type {express.app}
         **/
        this.app            = express();

        /*
         * @type {{}}
         **/
        this.config         = config;

        /*
         * @type {ExpressRoutes}
         **/
        this.expressRoutes  = null; // Injected by AirBugConfiguration

        /*
         * @type {}
         **/
        this.secret         = null;

        /*
         * @type {}
         **/
        this.sessionKey     = null;

        /*
         * @type {}
         **/
        this.cookieParser   = null;

        /*
         * @type {}
         **/
        this.sessionStore   = null;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @return {ExpressApp}
     **/
    initialize: function(){

        var app             = this.app;
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

        // Configure App
        //-------------------------------------------------------------------------------
        this.configure(app);

        // Routes
        //-------------------------------------------------------------------------------
        this.enableRoutes(app);

        // Graceful Shut Down
        //-------------------------------------------------------------------------------
        this.enableGracefulShutdown(app);

        return this;

    },


    //-------------------------------------------------------------------------------
    //  Getters and Setters
    //-------------------------------------------------------------------------------

    /*
     * @return {}
     **/
    getApp: function(){
        return this.app;
    },

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
     * @param {express.app} app
     **/
    configure: function(app){
        var config = this.config;
        var cookieParser = this.cookieParser;
        var secret = this.secret;
        var sessionKey = this.sessionKey;
        
        console.log("config:", config);
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
     * @param {express.app} app
     **/
    enableRoutes: function(app){
        this.expressRoutes.enableAll(app);
    },

    /*
     * @private
     * @param {express.app} app
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
    
    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressApp', ExpressApp);
