//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugworker')

//@Export('EmailBounceWorkerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugworker.EmailBounceTaskProcessor')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugtask.TaskProcessor')
//@Require('bugmeta.BugMeta')
//@Require('configbug.Configbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var redis                           = require('redis');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var EmailBounceTaskProcessor        = bugpack.require('airbugworker.EmailBounceTaskProcessor');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration                  = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TaskProcessor                   = bugpack.require('bugtask.TaskProcessor');
var Configbug                       = bugpack.require('configbug.Configbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationAnnotation.configuration;
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;
var $parallel                       = BugFlow.$parallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EmailBounceWorkerConfiguration = Class.extend(Obj, {

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
         * @type {Configbug}
         */
        this._configbug                     = null;

        /**
         * @private
         * @type {EmailBounceTaskProcessor}
         */
        this._emailBounceTaskProcessor      = null;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        var _this = this;
        console.log("Deinitializing EmailBounceWorkerConfiguration");
        $series([
            $task(function(flow) {
                if (!_this._emailBounceTaskProcessor.isStopped()) {
                    var hearProcessorStopped = function(event) {
                        _this._emailBounceTaskProcessor.removeEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                        flow.complete();
                    };
                    _this._emailBounceTaskProcessor.addEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                }
                if (_this._emailBounceTaskProcessor.isStarted()) {
                    _this._emailBounceTaskProcessor.stop();
                }
            })
        ]).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing EmailBounceWorkerConfiguration");

        $series([
            $task(function(flow) {
                /** @type {string} */
                var configName  = _this.generateConfigName();
                _this.loadConfig(configName, function(throwable, config) {
                    if (!throwable) {
                        _this.buildConfigs(config);
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this._emailBounceTaskProcessor.start();
                flow.complete();
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                console.log("EmailBounceWorkerConfiguration successfully initialized!");
            } else {
                console.log("EmailBounceWorkerConfiguration encountered an error while initializing - throwable:", throwable);
            }
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Configbug}
     */
    configbug: function() {
        this._configbug = new Configbug(BugFs.resolvePaths([__dirname, '../../resources/config']));
        return this._configbug;
    },

    /**
     * @return {console|Console}
     */
    console: function() {
        return console;
    },

    /**
     * @param {Logger} logger
     * @param {EmailBounceTaskManager} emailBounceTaskManager
     * @return {EmailBounceTaskProcessor}
     */
    emailBounceTaskProcessor: function(logger, emailBounceTaskManager) {
        this._emailBounceTaskProcessor = new EmailBounceTaskManager(logger, emailBounceTaskManager);
        return this._emailBounceTaskProcessor;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Config} config
     */
    buildConfigs: function(config) {
        //TODO
    },

    /**
     * @private
     * @return {string}
     */
    generateConfigName: function() {
        var configName = "dev";
        var index = process.argv.indexOf("--config");
        if (index > -1) {
            configName = process.argv[index + 1];
        } else if (process.env.CONFIGBUG) {
            configName = process.env.CONFIGBUG;
        }
        return configName;
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        this._configbug.getConfig(configName, callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(EmailBounceWorkerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(EmailBounceWorkerConfiguration).with(
    configuration("emailBounceWorkerConfiguration").modules([
        module("emailBounceTaskProcessor")
            .args([
                arg().ref("logger"),
                arg().ref("emailBounceTaskManager")
            ]),
        module("configbug"),
        module("console")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugworker.EmailBounceWorkerConfiguration", EmailBounceWorkerConfiguration);
