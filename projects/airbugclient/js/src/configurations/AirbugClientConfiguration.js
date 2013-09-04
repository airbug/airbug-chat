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
//@Require('airbug.ConversationManagerModule')
//@Require('airbug.CurrentUserManagerModule')
//@Require('airbug.NavigationModule')
//@Require('airbug.PageStateModule')
//@Require('airbug.RoomManagerModule')
//@Require('airbug.SessionModule')
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
var ConversationManagerModule   = bugpack.require('airbug.ConversationManagerModule');
var CurrentUserManagerModule    = bugpack.require('airbug.CurrentUserManagerModule');
var NavigationModule            = bugpack.require('airbug.NavigationModule');
var PageStateModule             = bugpack.require('airbug.PageStateModule');
var RoomManagerModule           = bugpack.require('airbug.RoomManagerModule');
var SessionModule               = bugpack.require('airbug.SessionModule');
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
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var BugCallRouter               = bugpack.require('bugroutes.BugCallRouter');
var CarapaceApplication         = bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter              = bugpack.require('carapace.CarapaceRouter');
var ControllerScan              = bugpack.require('carapace.ControllerScan');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');
var SocketIoConfig              = bugpack.require('socketio:client.SocketIoConfig');
var BrowserSocketIoFactory      = bugpack.require('socketio:factorybrowser.BrowserSocketIoFactory');
var SonarbugClient              = bugpack.require('sonarbugclient.SonarbugClient');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel       = BugFlow.$parallel;
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
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)}
     */
    initializeConfiguration: function(callback) {
        var _this               = this;
        var carapaceApplication = this._carapaceApplication;
        var controllerScan      = this._controllerScan;
        var socketIoConfig      = this._socketIoConfig;
        var trackerModule       = this._trackerModule;

        socketIoConfig.setHost("http://localhost/api/airbug");
        socketIoConfig.setResource("api/socket");
        socketIoConfig.setPort(8000);

        //TODO BRN: Pass the session id here...
        // this._bugCallClient.openConnection();

        controllerScan.scan();

        $series([
            $task(function(flow){
                _this.initializeTracking(function(error){
                    flow.complete(error);
                });
            }),
            $task(function(flow){
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

        $series([
            $task(function(flow){
                sonarbugClient.configure("http://sonarbug.com:80/socket-api", function(error){
                    if (!error) console.log('SonarBugClient configured');
                    flow.complete(error);
                });
            }),
            $parallel([
                $task(function(flow){
                    trackerModule.initialize(function(error){
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    carapaceApplication.addEventListener("RoutingRequest.Result", function(event){
                        var data = event.getData();
                        trackerModule.track("RoutingRequest.Result", data);
                    });
                    flow.complete();
                })
            ])
        ]).execute(function(error){
            if (!error) console.log("tracking initialized");
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
     * @return {BrowserSocketIoFactory}
     */
    browserSocketIoFactory: function() {
        return new BrowserSocketIoFactory();
    },

    /**
     * @param {CallClient} callClient
     * @param {CallManager} callManager
     * @return {BugCallClient}
     */
    bugCallClient: function(callClient, callManager) {
        this._bugCallClient = new BugCallClient(callClient, callManager);
        return this._bugCallClient;
    },

    /**
     * @param {BugCallClient} bugCallClient
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallClient) {
        return new BugCallRouter(bugCallClient);
    },

    /**
     * @param {SocketIoClient} socketIoClient
     * @return {CallClient}
     */
    callClient: function(socketIoClient) {
        return new CallClient(socketIoClient);
    },

    /**
     * @return {CallManager}
     */
    callManager: function() {
        return new CallManager();
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

    chatMessageManagerModule: function(airbugApi, currentUserManagerModule){
        return new ChatMessageManagerModule(airbugApi, currentUserManagerModule);
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
     * @return {ConversationManagerModule}
     */
    conversationManagerModule: function(airbugApi){
        return new ConversationManagerModule(airbugApi);
    },

    /**
     * @param {AirbugApi} airbugApi
     * @param {UserManagerModule} userManagerModule
     * @return {CurrentUserManagerModule}
     */
    currentUserManagerModule: function(airbugApi, userManagerModule, roomManagerModule){
        return new CurrentUserManagerModule(airbugApi, userManagerModule, roomManagerModule);
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
     * @return {RoomManagerModule}
     */
    roomManagerModule: function(airbugApi){
        return new RoomManagerModule(airbugApi);
    },

    /**
     * @return {SessionModule}
     */
    sessionModule: function(airbugApi) {
        return new SessionModule(airbugApi);
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
     * @return {TrackerModule}
     */
    trackerModule: function(sonarbugClient) {
        this._trackerModule = new TrackerModule(sonarbugClient);
        return this._trackerModule;
    },

    /**
     * @param {AirbugApi} airbugApi
     * @return {UserManagerModule}
     */
    userManagerModule: function(airbugApi){
        return new UserManagerModule(airbugApi);
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
                arg().ref("currentUserManagerModule")
            ]),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
        module("conversationManagerModule")
            .args([
                arg().ref("airbugApi")
            ]),
        module("currentUserManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("userManagerModule"),
                arg().ref("roomManagerModule")
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
                arg().ref("airbugApi")
            ]),
        module("sessionModule")
            .args([
                arg().ref("airbugApi")
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
                arg().ref("sonarbugClient")
            ]),
        module("userManagerModule")
            .args([
                arg().ref("airbugApi")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
