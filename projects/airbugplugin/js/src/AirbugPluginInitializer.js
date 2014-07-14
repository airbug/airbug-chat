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

//@Export('airbugplugin.AirbugPluginInitializer')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.RoutingRequest')
//@Require('jquery.JQuery')
//@Require('zeroclipboard.ZeroClipboard')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Flows                   = bugpack.require('Flows');
    var Obj                     = bugpack.require('Obj');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var RoutingRequest          = bugpack.require('carapace.RoutingRequest');
    var JQuery                  = bugpack.require('jquery.JQuery');
    var ZeroClipboard           = bugpack.require('zeroclipboard.ZeroClipboard');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var property                = PropertyTag.property;
    var $parallel               = Flows.$parallel;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var AirbugPluginInitializer = Class.extend(Obj, {

        _name: "airbugplugin.AirbugPluginInitializer",


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
             * @type {AirbugApi}
             */
            this.airbugApi             = null;

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig    = null;

            /**
             * @private
             * @type {BugCallClient}
             */
            this.bugCallClient         = null;

            /**
             * @private
             * @type {BugCallRouter}
             */
            this.bugCallRouter         = null;

            /**
             * @private
             * @type {CarapaceApplication}
             */
            this.carapaceApplication   = null;

            /**
             * @private
             * @type {ControllerTagScan}
             */
            this.controllerTagScan        = null;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = null;

            /**
             * @private
             * @type {SocketIoConfig}
             */
            this.socketIoConfig        = null;

            /**
             * @private
             * @type {SonarbugClient}
             */
            this.sonarbugClient        = null;

            /**
             * @private
             * @type {TrackerModule}
             */
            this.trackerModule         = null;

            /**
             * @private
             * @type {WindowUtil}
             */
            this.windowUtil            = null;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
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
            var _this                       = this;
            var port                        = this.windowUtil.getPort();
            var baseUrl                     = this.windowUtil.getBaseUrl();

            this.socketIoConfig.setHost(baseUrl + "/api/airbug");
            this.socketIoConfig.setResource("api/socket");
            this.socketIoConfig.setPort(port);

            this.controllerTagScan.scan();

            this.bugCallClient.registerRequestProcessor(this.bugCallRouter);

            $series([
                $task(function(flow) {
                    _this.airbugApi.connect(null, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.initializeTracking(function(error) {
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this.carapaceApplication.start(function(error) {
                        if (!error) {
                            var spinner = JQuery("#application-loading-spinner");
                            spinner.hide();
                        }
                        flow.complete(error);
                    });
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        initializeTracking: function(callback) {
            var _this               = this;
            var sonarbugClient      = this.sonarbugClient;
            var trackerModule       = this.trackerModule;
            var carapaceApplication = this.carapaceApplication;

            if (this.airbugStaticConfig.getEnableTracking()) {
                carapaceApplication.addEventListener(RoutingRequest.EventType.PROCESSED, function(event) {
                    var data = event.getData();
                    trackerModule.track("RoutingRequest.Result", data);
                });
                trackerModule.setTrackingEnabled(true);

                // NOTE BRN: We configure sonarbug here but we don't wait for the connection since that slows down the load
                // of the site. Tracking messages will queue up...

                sonarbugClient.configure("http://sonarbug.com:80", function(error) {
                    if (!error) {
                        _this.logger.info('SonarBugClient configured');
                    } else {
                        _this.logger.error(error);
                    }
                });

                $task(function(flow) {
                    trackerModule.initialize(function(error) {
                        flow.complete(error);
                    });
                }).execute(function(error) {
                    if (!error) {
                        console.log("tracking initialized");
                    }
                    callback(error);
                });
            } else {
                trackerModule.setTrackingEnabled(false);
                callback();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AirbugPluginInitializer, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugPluginInitializer).with(
        module("airbugPluginInitializer")
            .properties([
                property("airbugApi").ref("airbugApi"),
                property("airbugStaticConfig").ref("airbugStaticConfig"),
                property("bugCallClient").ref("bugCallClient"),
                property("bugCallRouter").ref("bugCallRouter"),
                property("carapaceApplication").ref("carapaceApplication"),
                property("controllerTagScan").ref("controllerTagScan"),
                property("logger").ref("logger"),
                property("socketIoConfig").ref("socketIoConfig"),
                property("sonarbugClient").ref("sonarbugClient"),
                property("trackerModule").ref("trackerModule"),
                property("windowUtil").ref("windowUtil")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugplugin.AirbugPluginInitializer", AirbugPluginInitializer);
});
