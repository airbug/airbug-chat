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

//@Export('airbug.AirbugClientInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
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

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var BugFlow                         = bugpack.require('bugflow.BugFlow');
    var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
    var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
    var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var RoutingRequest                  = bugpack.require('carapace.RoutingRequest');
    var JQuery                          = bugpack.require('jquery.JQuery');
    var ZeroClipboard                   = bugpack.require('zeroclipboard.ZeroClipboard');


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

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializeModule}
     */
    var AirbugClientInitializer = Class.extend(Obj, {

        _name: "airbug.AirbugClientInitializer",


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
             * @type {ControllerScan}
             */
            this.controllerScan        = null;

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
            var _this                       = this;
            var carapaceApplication         = this.carapaceApplication;
            var controllerScan              = this.controllerScan;
            var socketIoConfig              = this.socketIoConfig;
            var port                        = this.windowUtil.getPort();
            var baseUrl                     = this.windowUtil.getBaseUrl();


            socketIoConfig.setHost(baseUrl + "/api/airbug");
            socketIoConfig.setResource("api/socket");
            socketIoConfig.setPort(port);

            ZeroClipboard.config({
                allowScriptAccess: "always",
                moviePath: this.airbugStaticConfig.getStaticUrl() + "/zeroclipboard/ZeroClipboard.swf",
                trustedDomains: [
                    this.windowUtil.getHost()
                ],
                forceHandCursor: true
            });

            controllerScan.scan();

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
                    carapaceApplication.start(function(error) {
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

    Class.implement(AirbugClientInitializer, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(AirbugClientInitializer).with(
        module("airbugClientInitializer")
            .properties([
                property("airbugApi").ref("airbugApi"),
                property("airbugStaticConfig").ref("airbugStaticConfig"),
                property("bugCallClient").ref("bugCallClient"),
                property("bugCallRouter").ref("bugCallRouter"),
                property("carapaceApplication").ref("carapaceApplication"),
                property("controllerScan").ref("controllerScan"),
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

    bugpack.export("airbug.AirbugClientInitializer", AirbugClientInitializer);
});
