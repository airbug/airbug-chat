//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('usermedia')

//@Export('UserMediaServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var express     = require('express');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Annotate                    = bugpack.require('annotate.Annotate');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var BugFs                       = bugpack.require('bugfs.BugFs');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ExpressApp                  = bugpack.require('express.ExpressApp');
var ExpressServer               = bugpack.require('express.ExpressServer');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate        = Annotate.annotate;
var arg             = ArgAnnotation.arg;
var configuration   = ConfigurationAnnotation.configuration;
var module          = ModuleAnnotation.module;
var property        = PropertyAnnotation.property;
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
        // Declare Variables
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
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)}
        */
    initializeConfiguration: function(callback) {
        var _this = this;
        this._expressApp.configure(function() {
            //TEST
            console.log("made it " + (process.env.PORT || 8000));
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
     * @return {ExpressApp}
     */
    expressApp: function() {
        this._expressApp = new ExpressApp();
        return this._expressApp;
    },

    /**
     * @param {ExpressApp} expressApp
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        this._expressServer = new ExpressServer(expressApp);
        return this._expressServer;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserMediaServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// Annotate
//-------------------------------------------------------------------------------

annotate(UserMediaServerConfiguration).with(
    configuration().modules([
        module("expressApp"),
        module("expressServer")
            .args([
                arg("expressApp").ref("expressApp")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("usermedia.UserMediaServerConfiguration", UserMediaServerConfiguration);