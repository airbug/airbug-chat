//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirBugConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Annotate                = bugpack.require('annotate.Annotate');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');

var ExpressServer           = bugpack.require('airbugserver.ExpressServer');
var ExpressRoutes           = bugpack.require('airbugserver.ExpressRoutes');
var SocketManager           = bugpack.require('airbugserver.SocketManager');
var SocketRoutes            = bugpack.require('airbugserver.SocketRoutes');
var SocketsMap              = bugpack.require('airbugserver.SocketsMap');

var ChatMessagesApi         = bugpack.require('airbugserver.ChatMessagesApi');
var ConversationsApi        = bugpack.require('airbugserver.ConversationsApi');
var RoomsApi                = bugpack.require('airbugserver.RoomsApi');
var UsersApi                = bugpack.require('airbugserver.UsersApi');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate                = Annotate.annotate;
var arg                     = ArgAnnotation.arg;
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirBugConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirBugServer}
         */
        this._airBugServer = null;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeConfiguration: function() {
        this._airBugServer.start();
    },


    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {AirBugServer}
     */
    airBugServer: function() {
        this._airBugServer = new AirBugServer();
        return this._airBugServer;
    },

    /**
     * @return {ChatMessagesApi}
     */
    chatMessagesApi: function(){
        return new ChatMessagesApi();
    },

    /**
     * @return {ConversationsApi}
     */
    coversationsApi: function(){
        return new ConversationsApi();
    },

    /**
     * @return {ExpressServer}
     */
    expressApp: function() {
        return new ExpressApp();
    },

    /**
     * @return {ExpressRoutes}
     */
    expressRoutes: function() {
        return new ExpressRoutes();
    },

    /**
     * @return {ExpressServer}
     */
    expressServer: function() {
        return new ExpressServer();
    },

    mongoose: function(){
        return mongoose;
    },

    /**
     * @return {RoomsApi}
     */
    roomApi: function(){
        return new RoomsApi();
    },

    /**
     * @return {MemoryStore}
     */
    sessionStore: function(){
        return new connect.middleware.session.MemoryStore();
    },

    /**
     * @return {SocketManager}
     */
    socketManager: function() {
        return new SocketManager().initialize();
    },

    /**
     * @return {SocketRoutes}
     */
    socketRoutes: function() {
        return new SocketRoutes();
    },

    socketsMap: function() {
        return new SocketsMap();
    },

    /**
     * @return {UsersApi}
     */
    usersApi: function(){
        return new UsersApi();
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirBugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// Annotate
//-------------------------------------------------------------------------------

annotate(AirBugServerConfiguration).with(
    configuration().modules([
        
        //-------------------------------------------------------------------------------
        // AirBugServer
        //-------------------------------------------------------------------------------
        module("airBugServer")
            .properties([
                property("expressServer").ref("expressServer"),
                property("mongoose").ref("mongoose"),
                property("socketManager").ref("socketManager")
            ]),

        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------
        module("expressApp"),
        module("expressRoutes"),
        module("expressServer")
            .properties([
                property("sessionStore").ref("sessionStore")
            ]),

        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------
        module("socketManager")
            .properties([
                property("server").ref("expressServer"),
                // property("socketIoManager").ref("socketIoManager"),
                property("socketsMap").ref("socketsMap")
            ]),
        module("socketsMap"),
        module("socketRoutes"),

        //-------------------------------------------------------------------------------
        // Apis
        //-------------------------------------------------------------------------------
        module("chatMessagesApi"),
        module("conversationsApi"),
        module("roomsApi"),
        module("usersApi")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirBugConfiguration", AirBugConfiguration);
