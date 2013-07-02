//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugApi')
//@Require('airbug.CurrentUserManagerModule')
//@Require('airbug.NavigationModule')
//@Require('airbug.PageStateModule')
//@Require('airbug.RoomManagerModule')
//@Require('airbug.SessionModule')
//@Require('airbug.UserManagerModule')
//@Require('annotate.Annotate')
//@Require('bugcall.BugCallClient')
//@Require('bugcall.CallClient')
//@Require('bugcall.CallManager')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceApplication')
//@Require('carapace.CarapaceRouter')
//@Require('carapace.ControllerScan')
//@Require('socketio:client.SocketIoClient')
//@Require('socketio:client.SocketIoConfig')
//@Require('socketio:factorybrowser.BrowserSocketIoFactory')


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
var CurrentUserManagerModule    = bugpack.require('airbug.CurrentUserManagerModule');
var NavigationModule            = bugpack.require('airbug.NavigationModule');
var PageStateModule             = bugpack.require('airbug.PageStateModule');
var RoomManagerModule           = bugpack.require('airbug.RoomManagerModule');
var SessionModule               = bugpack.require('airbug.SessionModule');
var UserManagerModule           = bugpack.require('airbug.UserManagerModule');
var Annotate                    = bugpack.require('annotate.Annotate');
var BugCallClient               = bugpack.require('bugcall.BugCallClient');
var CallClient                  = bugpack.require('bugcall.CallClient');
var CallManager                 = bugpack.require('bugcall.CallManager');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var AutowiredScan               = bugpack.require('bugioc.AutowiredScan');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var CarapaceApplication         = bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter              = bugpack.require('carapace.CarapaceRouter');
var ControllerScan              = bugpack.require('carapace.ControllerScan');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');
var SocketIoConfig              = bugpack.require('socketio:client.SocketIoConfig');
var BrowserSocketIoFactory      = bugpack.require('socketio:factorybrowser.BrowserSocketIoFactory');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate        = Annotate.annotate;
var arg             = ArgAnnotation.arg;
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
        this._socketIoConfig.setHost("http://localhost/api/airbug");
        this._socketIoConfig.setResource("api/socket");
        this._socketIoConfig.setPort(8000);

        //TODO BRN: Pass the session id here...
        this._bugCallClient.openConnection();

        this._controllerScan.scan();
        this._carapaceApplication.start(callback);
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

    /**
     * @param {CarapaceApplication} carapaceApplication
     * @return {ControllerScan}
     */
    controllerScan: function(carapaceApplication) {
        this._controllerScan = new ControllerScan(carapaceApplication);
        return this._controllerScan;
    },

    currentUserManagerModule: function(airbugApi, userManagerModule){
        return new CurrentUserManagerModule(airbugApi, userManagerModule);
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
// Annotate
//-------------------------------------------------------------------------------

annotate(AirbugClientConfiguration).with(
    configuration().modules([
        module("airbugApi")
            .args([
                arg("bugCallClient").ref("bugCallClient")
            ]),
        module("browserSocketIoFactory"),
        module("bugCallClient")
            .args([
                arg("callClient").ref("callClient"),
                arg("callManager").ref("callManager")
            ]),
        module("callClient")
            .args([
                arg("socketIoClient").ref("socketIoClient")
            ]),
        module("callManager"),
        module("carapaceApplication")
            .args([
                arg().ref("carapaceRouter")
            ]),
        module("carapaceRouter"),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
        module("currentUserManagerModule")
            .args([
                arg("airbugApi").ref("airbugApi"),
                arg("userManagerModule").ref("userManagerModule")
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
                arg("airbugApi").ref("airbugApi")
            ]),
        module("sessionModule")
            .args([
                arg("airbugApi").ref("airbugApi")
            ]),
        module("socketIoClient")
            .args([
                arg("socketIoFactory").ref("browserSocketIoFactory"),
                arg("socketIoConfig").ref("socketIoConfig")
            ]),
        module("socketIoConfig"),
        module("userManagerModule")
            .args([
                arg("airbugApi").ref("airbugApi")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
