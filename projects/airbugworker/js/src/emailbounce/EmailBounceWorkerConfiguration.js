/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugworker.EmailBounceWorkerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('airbugworker.EmailBounceTaskProcessor')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskProcessor')
//@Require('configbug.Configbug')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var redis                       = require('redis');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Flows                       = bugpack.require('Flows');
    var Obj                         = bugpack.require('Obj');
    var EmailBounceTaskProcessor    = bugpack.require('airbugworker.EmailBounceTaskProcessor');
    var BugFs                       = bugpack.require('bugfs.BugFs');
    var ArgTag                      = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag            = bugpack.require('bugioc.ConfigurationTag');
    var IInitializingModule         = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag                   = bugpack.require('bugioc.ModuleTag');
    var PropertyTag                 = bugpack.require('bugioc.PropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var TaskProcessor               = bugpack.require('bugtask.TaskProcessor');
    var Configbug                   = bugpack.require('configbug.Configbug');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var configuration               = ConfigurationTag.configuration;
    var module                      = ModuleTag.module;
    var property                    = PropertyTag.property;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var EmailBounceWorkerConfiguration = Class.extend(Obj, {

        _name: "airbugworker.EmailBounceWorkerConfiguration",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
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
        initializeModule: function(callback) {
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

    Class.implement(EmailBounceWorkerConfiguration, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EmailBounceWorkerConfiguration).with(
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
});
