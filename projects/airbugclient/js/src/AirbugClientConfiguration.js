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
//@Require('airbug.WindowUtil')
//@Require('bugcall.BugCallCallProcessor')
//@Require('bugcall.BugCallClient')
//@Require('bugcall.BugCallRequestProcessor')
//@Require('bugcall.CallClient')
//@Require('bugcall.CallManager')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('carapace.CarapaceApplication')
//@Require('carapace.CarapaceRouter')
//@Require('carapace.ControllerScan')
//@Require('loggerbug.Logger')
//@Require('socketio:client.SocketIoClient')
//@Require('socketio:client.SocketIoConfig')
//@Require('socketio:factorybrowser.BrowserSocketIoFactory')
//@Require('sonarbugclient.SonarbugClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Url                         = bugpack.require('Url');
var AirbugApi                   = bugpack.require('airbug.AirbugApi');
var AirbugClientConfig          = bugpack.require('airbug.AirbugClientConfig');
var WindowUtil                  = bugpack.require('airbug.WindowUtil');
var BugCallCallProcessor        = bugpack.require('bugcall.BugCallCallProcessor');
var BugCallClient               = bugpack.require('bugcall.BugCallClient');
var BugCallRequestProcessor     = bugpack.require('bugcall.BugCallRequestProcessor');
var CallClient                  = bugpack.require('bugcall.CallClient');
var CallManager                 = bugpack.require('bugcall.CallManager');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var BugCallRouter               = bugpack.require('bugroute:bugcall.BugCallRouter');
var CarapaceApplication         = bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter              = bugpack.require('carapace.CarapaceRouter');
var ControllerScan              = bugpack.require('carapace.ControllerScan');
var Logger                      = bugpack.require('loggerbug.Logger');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');
var SocketIoConfig              = bugpack.require('socketio:client.SocketIoConfig');
var BrowserSocketIoFactory      = bugpack.require('socketio:factorybrowser.BrowserSocketIoFactory');
var SonarbugClient              = bugpack.require('sonarbugclient.SonarbugClient');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;
var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var configuration               = ConfigurationAnnotation.configuration;
var module                      = ModuleAnnotation.module;
var property                    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugClientConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallClient} bugCallClient
     * @return {AirbugApi}
     */
    airbugApi: function(bugCallClient) {
        return new AirbugApi(bugCallClient);
    },

    /**
     * @returns {AirbugClientConfig}
     */
    airbugClientConfig: function() {
        return new AirbugClientConfig(_appConfig);
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
     * @param {BugCallRequestProcessor} requestProcessor
     * @return {BugCallClient}
     */
    bugCallClient: function(callClient, callManager, requestProcessor) {
        return new BugCallClient(callClient, callManager, requestProcessor);
    },

    /**
     * @param {BugCallClient} bugCallRequestEventDispatcher
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallRequestEventDispatcher) {
        return new BugCallRouter(bugCallRequestEventDispatcher);
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
     * @return {BugCallCallProcessor}
     */
    callProcessor: function() {
        return new BugCallCallProcessor();
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
        return new CarapaceApplication(carapaceRouter);
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
        return new ControllerScan(carapaceApplication);
    },

    /**
     * @return {Logger}
     */
    logger: function() {
        return new Logger();
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
        return new SocketIoConfig({});
    },

    /**
     * @return {SonarbugClient}
     */
    sonarbugClient: function() {
        return SonarbugClient.getInstance();
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
        return new WindowUtil(window);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugClientConfiguration).with(
    configuration("airbugClientConfiguration").modules([
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
        module("callProcessor"),
        module("carapaceApplication")
            .args([
                arg().ref("carapaceRouter")
            ]),
        module("carapaceRouter"),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
        module("logger"),
        module("requestProcessor"),
        module("socketIoClient")
            .args([
                arg().ref("browserSocketIoFactory"),
                arg().ref("socketIoConfig")
            ]),
        module("socketIoConfig"),
        module("sonarbugClient"),
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
