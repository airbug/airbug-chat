//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


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

var AirbugClientInitializer = Class.extend(Obj, {

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
         * @type {AirbugApi}
         */
        this.airbugApi             = null;

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig    = null;

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

        console.log("airbugApi.connect call");
        _this.airbugApi.connect();

        controllerScan.scan();

        this.bugCallClient.registerRequestProcessor(this.bugCallRouter);

        $series([
            $task(function(flow) {
                _this.initializeTracking(function(error) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                carapaceApplication.start(function(error) {
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
        var sonarbugClient      = this.sonarbugClient;
        var trackerModule       = this.trackerModule;
        var carapaceApplication = this.carapaceApplication;

        if (this.airbugClientConfig.getEnableTracking()) {
            carapaceApplication.addEventListener(RoutingRequest.EventType.PROCESSED, function(event) {
                var data = event.getData();
                trackerModule.track("RoutingRequest.Result", data);
            });
            trackerModule.setTrackingEnabled(true);
            $series([
                $task(function(flow) {
                    sonarbugClient.configure("http://sonarbug.com:80/socket-api", function(error) {
                        if (!error) {
                            console.log('SonarBugClient configured');
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    trackerModule.initialize(function(error) {
                        flow.complete(error);
                    });
                })
            ]).execute(function(error) {
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
            property("airbugClientConfig").ref("airbugClientConfig"),
            property("bugCallClient").ref("bugCallClient"),
            property("bugCallRouter").ref("bugCallRouter"),
            property("carapaceApplication").ref("carapaceApplication"),
            property("controllerScan").ref("controllerScan"),
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