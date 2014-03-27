//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugworker')

//@Export('AirbugWorkerInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


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
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');
var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;
var $parallel                       = BugFlow.$parallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugWorkerInitializer = Class.extend(Obj, {

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
        this.configbug              = null;

        /**
         * @private
         * @type {WorkerManager}
         */
        this.workerManager          = null;
    },



    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        var _this = this;

        /** @type {Config} */
        var config = null;
        $series([
            $task(function(flow) {
                /** @type {string} */
                var configName  = _this.generateConfigName();
                _this.loadConfig(configName, function(throwable, loadedConfig) {
                    if (!throwable) {
                        config = loadedConfig;
                    }
                    flow.complete(throwable);
                });
            }),
            $parallel([
                $task(function(flow) {
                    _this.workerManager.createWorker("emailBounceWorker", {maxConcurrency: config.getProperty("emailBounceWorker.maxConcurrency")}, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ])
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

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
        this.configbug.getConfig(configName, callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirbugWorkerInitializer, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugWorkerInitializer).with(
    module("airbugWorkerInitializer")
        .properties([
            property("configbug").ref("configbug"),
            property("workerManager").ref("workerManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugworker.AirbugWorkerInitializer", AirbugWorkerInitializer);
