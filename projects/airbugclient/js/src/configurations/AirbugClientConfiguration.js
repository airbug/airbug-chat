//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugApi')
//@Require('airbug.ChatMessageManagerModule')
//@Require('airbug.CommandModule')
//@Require('airbug.ConversationManagerModule')
//@Require('airbug.CurrentUserManagerModule')
//@Require('airbug.NavigationModule')
//@Require('airbug.PageStateModule')
//@Require('airbug.RoomManagerModule')
//@Require('airbug.TrackerModule')
//@Require('airbug.UserManagerModule')
//@Require('bugcall.BugCallClient')
//@Require('bugcall.CallClient')
//@Require('bugcall.CallManager')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroutes.BugCallRouter')
//@Require('carapace.CarapaceApplication')
//@Require('carapace.CarapaceRouter')
//@Require('carapace.ControllerScan')
//@Require('carapace.RoutingRequest')
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
var AirbugApi                   = bugpack.require('airbug.AirbugApi');
var ChatMessageManagerModule    = bugpack.require('airbug.ChatMessageManagerModule');
var CommandModule               = bugpack.require('airbug.CommandModule');
var ConversationManagerModule   = bugpack.require('airbug.ConversationManagerModule');
var CurrentUserManagerModule    = bugpack.require('airbug.CurrentUserManagerModule');
var NavigationModule            = bugpack.require('airbug.NavigationModule');
var PageStateModule             = bugpack.require('airbug.PageStateModule');
var RoomManagerModule           = bugpack.require('airbug.RoomManagerModule');
var TrackerModule               = bugpack.require('airbug.TrackerModule');
var UserManagerModule           = bugpack.require('airbug.UserManagerModule');
var BugCallClient               = bugpack.require('bugcall.BugCallClient');
var CallClient                  = bugpack.require('bugcall.CallClient');
var CallManager                 = bugpack.require('bugcall.CallManager');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var AutowiredScan               = bugpack.require('bugioc.AutowiredScan');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var BugCallRouter               = bugpack.require('bugroutes.BugCallRouter');
var CarapaceApplication         = bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter              = bugpack.require('carapace.CarapaceRouter');
var ControllerScan              = bugpack.require('carapace.ControllerScan');
var RoutingRequest              = bugpack.require('carapace.RoutingRequest');
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
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)}
     */
    initializeConfiguration: function(callback) {
        var _this                       = this;
        var carapaceApplication         = this._carapaceApplication;
        var controllerScan              = this._controllerScan;
        var currentUserManagerModule    = this._currentUserManagerModule;
        var socketIoConfig              = this._socketIoConfig;
        var trackerModule               = this._trackerModule;


        socketIoConfig.setHost("http://localhost/api/airbug");
        socketIoConfig.setResource("api/socket");
        socketIoConfig.setPort(8000);

        //TODO BRN: Pass the session id here...
        console.log("airbugApi.connect call");
       _this._airbugApi.connect();

        controllerScan.scan();

        currentUserManagerModule.configure();

        $series([
            $task(function(flow) {
                _this.initializeTracking(function(error){
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                carapaceApplication.start(function(error){
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    initializeTracking: function(callback){
        var sonarbugClient      = this._sonarbugClient;
        var trackerModule       = this._trackerModule;
        var carapaceApplication = this._carapaceApplication;

        carapaceApplication.addEventListener(RoutingRequest.EventType.PROCESSED, function(event){
            var data = event.getData();
            trackerModule.track("RoutingRequest.Result", data);
        });

        $series([
            $task(function(flow){
                sonarbugClient.configure("http://sonarbug.com:80/socket-api", function(error){
                    if (!error) console.log('SonarBugClient configured');
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                trackerModule.initialize(function(error){
                    flow.complete(error);
                });
            })
        ]).execute(function(error){
            if (!error) console.log("tracking initialized");
            callback(error);
        });
    },


    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {bugcall.BugCallClient} bugCallClient
     * @return {airbug.AirbugApi}
     */
    airbugApi: function(bugCallClient) {
        this._airbugApi = new AirbugApi(bugCallClient); 
        return this._airbugApi;
    },

    /**
     * @return {socketio:factorybrowser.BrowserSocketIoFactory}
     */
    browserSocketIoFactory: function() {
        return new BrowserSocketIoFactory();
    },

    /**
     * @param {bugcall.CallClient} callClient
     * @param {bugcall.CallManager} callManager
     * @return {bugcall.BugCallClient}
     */
    bugCallClient: function(callClient, callManager) {
        this._bugCallClient = new BugCallClient(callClient, callManager);
        return this._bugCallClient;
    },

    /**
     * @param {bugcall.BugCallClient} bugCallRequestEventDispatcher
     * @return {bugroutes.BugCallRouter}
     */
    bugCallRouter: function(bugCallRequestEventDispatcher) {
        this._bugCallRouter = new BugCallRouter(bugCallRequestEventDispatcher);
        return this._bugCallRouter;
    },

    /**
     * @param {socketio:client.SocketIoClient} socketIoClient
     * @return {bugcall.CallClient}
     */
    callClient: function(socketIoClient) {
        console.log("*****************************************************");
        console.log("socketIoClient:", socketIoClient);
        return new CallClient(socketIoClient);
    },

    /**
     * @return {bugcall.CallManager}
     */
    callManager: function() {
        return new CallManager();
    },

    /**
     * @param {carapace.CarapaceRouter} carapaceRouter
     * @return {carapace.CarapaceApplication}
     */
    carapaceApplication: function(carapaceRouter) {
        this._carapaceApplication = new CarapaceApplication(carapaceRouter);
        return this._carapaceApplication;
    },

    /**
     * @return {carapace.CarapaceRouter}
     */
    carapaceRouter: function() {
        return new CarapaceRouter();
    },

    /**
     * @param {airbug.AirbugApi} airbugApi
     * @param {meldbug.MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @param {airbug.CurrentUserManagerModule} currentUserManagerModule
     * @param {airbug.ConversationManagerModule} conversationManagerModule
     * @return {airbug.chatMessageManagerModule}
     */
    chatMessageManagerModule: function(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule) {
        return new ChatMessageManagerModule(airbugApi, meldStore, meldBuilder, currentUserManagerModule, conversationManagerModule);
    },

    /**
     * @return {airbug.CommandModule}
     */
    commandModule: function() {
        return new CommandModule();
    },

    /**
     * @param {carapace.CarapaceApplication} carapaceApplication
     * @return {ControllerScan}
     */
    controllerScan: function(carapaceApplication) {
        this._controllerScan = new ControllerScan(carapaceApplication);
        return this._controllerScan;
    },

    /**
     * @param {airbug.AirbugApi} airbugApi
     * @param {meldbug.MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {airbug.ConversationManagerModule}
     */
    conversationManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new ConversationManagerModule(airbugApi, meldStore, meldBuilder);
    },

    /**
     * @param {airbug.AirbugApi} airbugApi
     * @param {meldbug.MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @param {airbug.UserManagerModule} userManagerModule
     * @param {BugCallRouter} bugCallRouter
     * @return {airbug.CurrentUserManagerModule}
     */
    currentUserManagerModule: function(airbugApi, meldStore, meldBuilder, userManagerModule, bugCallRouter) {
        this._currentUserManagerModule = new CurrentUserManagerModule(airbugApi, meldStore, meldBuilder, userManagerModule, bugCallRouter);
        return this._currentUserManagerModule;
    },

    /**
     * @return {airbug.NavigationModule}
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
     * @param {meldbug.AirbugApi} airbugApi
     * @param {meldbug.MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {airbug.RoomManagerModule}
     */
    roomManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new RoomManagerModule(airbugApi, meldStore, meldBuilder);
    },

    /**
     * @param {ISocketFactory} socketIoFactory
     * @param {socketio:client.SocketIoConfig} socketIoConfig
     * @return {socketio:client.SocketIoClient}
     */
    socketIoClient: function(socketIoFactory, socketIoConfig) {
        return new SocketIoClient(socketIoFactory, socketIoConfig);
    },

    /**
     * @return {socketio:client.SocketIoConfig}
     */
    socketIoConfig: function() {
        this._socketIoConfig = new SocketIoConfig({});
        this._socketIoConfig.setHost("http://localhost:8000");
        this._socketIoConfig.setPort(8000);
        this._socketIoConfig.setResource("api/airbug");
        return this._socketIoConfig;
    },

    /**
     * @return {sonarbugclient.SonarbugClient}
     */
    sonarbugClient: function() {
        this._sonarbugClient = SonarbugClient.getInstance();
        return this._sonarbugClient;
    },

    /**
     * @param {sonarbugclient.SonarBugClient} sonarbugClient
     * @param {CommandModule} commandModule
     * @return {airbug.TrackerModule}
     */
    trackerModule: function(sonarbugClient, commandModule) {
        this._trackerModule = new TrackerModule(sonarbugClient, commandModule);
        return this._trackerModule;
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {meldbug.MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @return {UserManagerModule}
     */
    userManagerModule: function(airbugApi, meldStore, meldBuilder) {
        return new UserManagerModule(airbugApi, meldStore, meldBuilder);
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
        module("browserSocketIoFactory"),
        module("bugCallClient")
            .args([
                arg().ref("callClient"),
                arg().ref("callManager")
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
                arg().ref("bugCallRouter")
            ]),
        module("navigationModule")
            .properties([
                property("carapaceRouter").ref("carapaceRouter")
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
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
