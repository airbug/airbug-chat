//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('usermedia.UserMediaServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var express     = require('express');
var http        = require('http');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var BugFs                       = bugpack.require('bugfs.BugFs');
var ArgTag               = bugpack.require('bugioc.ArgTag');
var ConfigurationTag     = bugpack.require('bugioc.ConfigurationTag');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleTag            = bugpack.require('bugioc.ModuleTag');
var PropertyTag          = bugpack.require('bugioc.PropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var ExpressApp                  = bugpack.require('express.ExpressApp');
var ExpressServer               = bugpack.require('express.ExpressServer');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg             = ArgTag.arg;
var bugmeta         = BugMeta.context();
var configuration   = ConfigurationTag.configuration;
var module          = ModuleTag.module;
var property        = PropertyTag.property;
var $series         = BugFlow.$series;
var $task           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserMediaServerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ExpressApp}
         * @private
         */
        this._expressApp = null;

        /**
         * @private
         * @type {ExpressServer}
         */
        this._expressServer = null;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        this._expressApp.configure(function() {
            //_this._expressApp.set('root', __dirname);
            _this._expressApp.set('port', (process.env.PORT || 8000));
            _this._expressApp.use(express.logger('dev'));
            _this._expressApp.use(express.static(BugFs.resolvePaths([__dirname, '../static']).getAbsolutePath()));
        });

        this._expressApp.configure('development', function() {
            _this._expressApp.use(express.errorHandler());
        });

        _this._expressApp.initialize();

        $series([
            $task(function(flow) {
                _this._expressServer.start(function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Express}
     */
    express: function() {
        return express;
    },

    /**
     * @param {Express} express
     * @return {ExpressApp}
     */
    expressApp: function(express) {
        this._expressApp = new ExpressApp(express);
        return this._expressApp;
    },

    /**
     * @param {ExpressApp} expressApp
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        this._expressServer = new ExpressServer(http, expressApp);
        return this._expressServer;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserMediaServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UserMediaServerConfiguration).with(
    configuration("userMediaServerConfiguration").modules([
        module("express"),
        module("expressApp"),
        module("expressServer")
            .args([
                arg().ref("expressApp")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("usermedia.UserMediaServerConfiguration", UserMediaServerConfiguration);
