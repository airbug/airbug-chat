//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Url')
//@Require('airbug.AirbugApi')
//@Require('airbug.AirbugClientConfig')
//@Require('airbug.ChatMessageManagerModule')
//@Require('airbug.CommandModule')
//@Require('airbug.ConversationManagerModule')
//@Require('airbug.CurrentUserManagerModule')
//@Require('airbug.NavigationModule')
//@Require('airbug.PageStateModule')
//@Require('airbug.RoomManagerModule')
//@Require('airbug.RoomMemberManagerModule')
//@Require('airbug.TrackerModule')
//@Require('airbug.UserManagerModule')
//@Require('airbug.WindowUtil')
//@Require('bugcall.BugCallClient')
//@Require('bugcall.CallClient')
//@Require('bugcall.CallManager')
//@Require('bugcall.BugCallRequestProcessor')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('carapace.CarapaceApplication')
//@Require('carapace.CarapaceRouter')
//@Require('carapace.ControllerScan')
//@Require('carapace.RoutingRequest')
//@Require('loggerbug.Logger')
//@Require('socketio:client.SocketIoClient')
//@Require('socketio:client.SocketIoConfig')
//@Require('socketio:factorybrowser.BrowserSocketIoFactory')
//@Require('sonarbugclient.SonarbugClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Url                         = bugpack.require('Url');
var AirbugApi                   = bugpack.require('airbug.AirbugApi');
var AirbugClientConfig          = bugpack.require('airbug.AirbugClientConfig');
var ChatMessageManagerModule    = bugpack.require('airbug.ChatMessageManagerModule');
var CommandModule               = bugpack.require('airbug.CommandModule');
var ConversationManagerModule   = bugpack.require('airbug.ConversationManagerModule');
var CurrentUserManagerModule    = bugpack.require('airbug.CurrentUserManagerModule');
var NavigationModule            = bugpack.require('airbug.NavigationModule');
var PageStateModule             = bugpack.require('airbug.PageStateModule');
var RoomManagerModule           = bugpack.require('airbug.RoomManagerModule');
var RoomMemberManagerModule     = bugpack.require('airbug.RoomMemberManagerModule');
var TrackerModule               = bugpack.require('airbug.TrackerModule');
var UserManagerModule           = bugpack.require('airbug.UserManagerModule');
var WindowUtil                  = bugpack.require('airbug.WindowUtil');
var BugCallClient               = bugpack.require('bugcall.BugCallClient');
var CallClient                  = bugpack.require('bugcall.CallClient');
var CallManager                 = bugpack.require('bugcall.CallManager');
var BugCallRequestProcessor     = bugpack.require('bugcall.BugCallRequestProcessor');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var BugCallRouter               = bugpack.require('bugroute:bugcall.BugCallRouter');
var CarapaceApplication         = bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter              = bugpack.require('carapace.CarapaceRouter');
var ControllerScan              = bugpack.require('carapace.ControllerScan');
var RoutingRequest              = bugpack.require('carapace.RoutingRequest');
var Logger                      = bugpack.require('loggerbug.Logger');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');
var SocketIoConfig              = bugpack.require('socketio:client.SocketIoConfig');
var BrowserSocketIoFactory      = bugpack.require('socketio:factorybrowser.BrowserSocketIoFactory');
var SonarbugClient              = bugpack.require('sonarbugclient.SonarbugClient');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series         = BugFlow.$series;
var $task           = BugFlow.$task;
var arg             = ArgAnnotation.arg;
var bugmeta         = BugMeta.context();
var configuration   = ConfigurationAnnotation.configuration;
var module          = ModuleAnnotation.module;
var property        = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugClientConfiguration = Class.extend(Obj, {

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
        this._airbugApi             = null;

        /**
         * @private
         * @type {BugCallClient}
         */
        this._bugCallClient         = null;

        /**
         * @private
         * @type {BugCallRouter}
         */
        this._bugCallRouter         = null;

        /**
         * @private
         * @type {CarapaceApplication}
         */
        this._carapaceApplication   = null;

        /**
         * @private
         * @type {ControllerScan}
         */
        this._controllerScan        = null;

        /**
         * @private
         * @type {SocketIoConfig}
         */
        this._socketIoConfig        = null;

        /**
         * @private
         * @type {boolean}
         */
        this.trackingEnabled        = false;

        /**
         * @private
         * @type {WindowUtil}
         */
        this._windowUtil            = null;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable)} callback
     */
    initializeConfiguration: function(callback) {
        var _this                       = this;
        var bugCallRouter               = this._bugCallRouter;
        var carapaceApplication         = this._carapaceApplication;
        var controllerScan              = this._controllerScan;
        var currentUserManagerModule    = this._currentUserManagerModule;
        var socketIoConfig              = this._socketIoConfig;
        var trackerModule               = this._trackerModule;
        var port                        = this._windowUtil.getPort();
        var baseUrl                     = this._windowUtil.getBaseUrl();


        socketIoConfig.setHost(baseUrl + "/api/airbug");
        socketIoConfig.setResource("api/socket");
        socketIoConfig.setPort(port);

        console.log("airbugApi.connect call");
        _this._airbugApi.connect();

        controllerScan.scan();

        currentUserManagerModule.configure();

        this._bugCallClient.registerRequestProcessor(this._bugCallRouter);

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

    initializeTracking: function(callback) {
        var sonarbugClient      = this._sonarbugClient;
        var trackerModule       = this._trackerModule;
        var carapaceApplication = this._carapaceApplication;

        carapaceApplication.addEventListener(RoutingRequest.EventType.PROCESSED, function(event) {
            var data = event.getData();
            trackerModule.track("RoutingRequest.Result", data);
        });

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
    },


    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallClient} bugCallClient
     * @return {AirbugApi}
     */
    airbugApi: function(bugCallClient) {
        this._airbugApi = new AirbugApi(bugCallClient);
        return this._airbugApi;
    },

    /**
     * @returns {AirbugClientConfig}
     */
    airbugClientConfig: function() {
        return new AirbugClientConfig(JSON.parse(_appConfig));
    },

    /**
     * @return {.BrowserSocketIoFactory}
     */
    browserSocketIoFactory: function() {
        return new BrowserSocketIoFactory();
    },

    /**
     * @param {CallClient} callClient
     * @param {CallManager} callManager
     * @param {BugCallRequestProcessor} requestProcessor
     * @return {BugCallClient}
     */
    bugCallClient: function(callClient, callManager, requestProcessor) {
        this._bugCallClient = new BugCallClient(callClient, callManager, requestProcessor);
        return this._bugCallClient;
    },

    /**
     * @param {BugCallClient} bugCallRequestEventDispatcher
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallRequestEventDispatcher) {
        this._bugCallRouter = new BugCallRouter(bugCallRequestEventDispatcher);
        return this._bugCallRouter;
    },

    /**
     * @param {SocketIoClient} socketIoClient
     * @return {CallClient}
     */
    callClient: function(socketIoClient) {
        console.log("socketIoClient:", socketIoClient);
        return new CallClient(socketIoClient);
    },

    /**
     * @return {CallManager}
     */
    callManager: function() {
        return new CallManager();
    },

    /**
     * @return {BugCallRequestProcessor}
     */
    requestProcessor: function() {
        return new BugCallRequestProcessor();
    },

    /**
     * @param {CarapaceRouter} carapaceRouter
     * @return {CarapaceApplication}
     */
    carapaceApplication: function(carapaceRouter) {
        this._carapaceApplication = new CarapaceApplication(carapaceRouter);
        return this._carapaceApplication;
    },

    /**
     * @return {CarapaceRouter}
     */
    carapaceRouter: function() {
        return new CarapaceRouter();
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @param {CurrentUserManagerModule} currentUserManagerModule
     * @param {ConversationManagerModule} conversationManagerModule
     * @return {ChatMessageManagerModule}
     */
    chatMessageManagerModule: function(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule) {
        return new ChatMessageManagerModule(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule);
    },

    /**
     * @return {CommandModule}
     */
    commandModule: function() {
        return new CommandModule();
    },

    /**
     * @param {CarapaceApplication} carapaceApplication
     * @return {ControllerScan}
     */
    controllerScan: function(carapaceApplication) {
        this._controllerScan = new ControllerScan(carapaceApplication);
        return this._controllerScan;
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {ConversationManagerModule}
     */
    conversationManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new ConversationManagerModule(airbugApi, meldStore, meldBuilder);
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @param {UserManagerModule} userManagerModule
     * @param {BugCallRouter} bugCallRouter
     * @return {CurrentUserManagerModule}
     */
    currentUserManagerModule: function(airbugApi, meldStore, meldBuilder, userManagerModule, navigationModule, bugCallRouter) {
        this._currentUserManagerModule = new CurrentUserManagerModule(airbugApi, meldStore, meldBuilder, userManagerModule, navigationModule, bugCallRouter);
        return this._currentUserManagerModule;
    },

    /**
     * @return {Logger}
     */
    logger: function() {
        return new Logger();
    },

    /**
     * @return {NavigationModule}
     */
    navigationModule: function() {
        return new NavigationModule();
    },

    /**
     * @return {PageStateModule}
     */
    pageStateModule: function() {
        return new PageStateModule();
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {RoomManagerModule}
     */
    roomManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new RoomManagerModule(airbugApi, meldStore, meldBuilder);
    },

    roomMemberManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new RoomMemberManagerModule(airbugApi, meldStore, meldBuilder);
    },

    /**
     * @param {ISocketFactory} socketIoFactory
     * @param {SocketIoConfig} socketIoConfig
     * @return {SocketIoClient}
     */
    socketIoClient: function(socketIoFactory, socketIoConfig) {
        return new SocketIoClient(socketIoFactory, socketIoConfig);
    },

    /**
     * @return {SocketIoConfig}
     */
    socketIoConfig: function() {
        this._socketIoConfig = new SocketIoConfig({});
        return this._socketIoConfig;
    },

    /**
     * @return {SonarbugClient}
     */
    sonarbugClient: function() {
        this._sonarbugClient = SonarbugClient.getInstance();
        return this._sonarbugClient;
    },

    /**
     * @param {SonarbugClient} sonarbugClient
     * @param {CommandModule} commandModule
     * @return {TrackerModule}
     */
    trackerModule: function(sonarbugClient, commandModule) {
        this._trackerModule = new TrackerModule(sonarbugClient, commandModule);
        return this._trackerModule;
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {UserManagerModule}
     */
    userManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new UserManagerModule(airbugApi, meldStore, meldBuilder);
    },

    /**
     * @return {Window}
     */
    window: function() {
        return window;
    },

    /**
     * @param {Window} window
     * @return {WindowUtil}
     */
    windowUtil: function(window) {
        this._windowUtil = new WindowUtil(window);
        return this._windowUtil;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirbugClientConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugClientConfiguration).with(
    configuration().modules([
        module("airbugApi")
            .args([
                arg().ref("bugCallClient")
            ]),
        module("airbugClientConfig"),
        module("browserSocketIoFactory"),
        module("bugCallClient")
            .args([
                arg().ref("callClient"),
                arg().ref("callManager"),
                arg().ref("requestProcessor")
            ]),
        module("bugCallRouter")
            .args([
                arg().ref("bugCallClient")
            ]),
        module("callClient")
            .args([
                arg().ref("socketIoClient")
            ]),
        module("callManager"),
        module("requestProcessor"),
        module("carapaceApplication")
            .args([
                arg().ref("carapaceRouter")
            ]),
        module("carapaceRouter"),
        module("chatMessageManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder"),
                arg().ref("currentUserManagerModule"),
                arg().ref("conversationManagerModule")
            ]),
        module("commandModule"),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
        module("conversationManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ]),
        module("currentUserManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder"),
                arg().ref("userManagerModule"),
                arg().ref("navigationModule"),
                arg().ref("bugCallRouter")
            ])
            .properties([
                property("logger").ref("logger")
            ]),
        module("logger"),
        module("navigationModule")
            .properties([
                property("carapaceRouter").ref("carapaceRouter"),
                property("window").ref("window")
            ]),
        module("pageStateModule")
            .properties([
                property("carapaceRouter").ref("carapaceRouter")
            ]),
        module("roomManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ]),
        module("roomMemberManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ]),
        module("socketIoClient")
            .args([
                arg().ref("browserSocketIoFactory"),
                arg().ref("socketIoConfig")
            ]),
        module("socketIoConfig"),
        module("sonarbugClient"),
        module("trackerModule")
            .args([
                arg().ref("sonarbugClient"),
                arg().ref("commandModule")
            ]),
        module("userManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ]),
        module("window"),
        module("windowUtil")
            .args([
                arg().ref("window")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
