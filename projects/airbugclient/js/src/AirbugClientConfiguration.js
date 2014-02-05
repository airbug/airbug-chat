//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Url')
//@Require('airbug.AirbugClientConfig')
//@Require('airbug.WindowUtil')
//@Require('bugcall.Call')
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
var AirbugClientConfig          = bugpack.require('airbug.AirbugClientConfig');
var WindowUtil                  = bugpack.require('airbug.WindowUtil');
var Call                        = bugpack.require('bugcall.Call');
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
     * @param {BugCallClient} bugCallRequestEventDispatcher
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallRequestEventDispatcher) {
        return new BugCallRouter(bugCallRequestEventDispatcher);
    },

    /**
     * @param {Logger} logger
     * @return {Call}
     */
    call: function(logger) {
        return new Call(logger);
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
        module("airbugClientConfig"),
        module("browserSocketIoFactory"),
        module("bugCallRouter")
            .args([
                arg().ref("bugCallClient")
            ]),
        module("call")
            .args([
                arg().ref("logger")
            ]),
        module("carapaceApplication")
            .args([
                arg().ref("carapaceRouter")
            ]),
        module("carapaceRouter"),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
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
