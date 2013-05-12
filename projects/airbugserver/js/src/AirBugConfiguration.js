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

var bugpack = require('bugpack').context();
var connect = require('connect');


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

var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var Conversation            = bugpack.require('airbugserver.Conversation');
var Dialogue                = bugpack.require('airbugserver.Dialogue');
var Room                    = bugpack.require('airbugserver.Room');
var RoomMember              = bugpack.require('airbugserver.RoomMember');
var User                    = bugpack.require('airbugserver.User');

var ChatMessagesApi         = bugpack.require('airbugserver.ChatMessagesApi');
var ConversationsApi        = bugpack.require('airbugserver.ConversationsApi');
var RoomsApi                = bugpack.require('airbugserver.RoomsApi');
var UsersApi                = bugpack.require('airbugserver.UsersApi');

//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate =      Annotate.annotate;
var arg =           ArgAnnotation.arg;
var configuration = ConfigurationAnnotation.configuration;
var module =        ModuleAnnotation.module;
var property =      PropertyAnnotation.property;


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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SplashController}
         */
        // this._splashController = null;
        this._airBugServer = null;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeConfiguration: function() {
        // this._splashController.start();
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
        return this.airBugServer;
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
     * @return {ExpressRoutes}
     */
    expressRoutes: function() {
        return new ExpressRoutes();
    },

    /**
     * @return {ExpressServer}
     */
    expressApp: function() {
        return new ExpressApp();
    },

    /**
     * @return {ExpressServer}
     */
    expressServer: function() {
        return new ExpressServer();
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
        return new SocketManager();
    },

    /**
     * @return {SocketRoutes}
     */
    socketRoutes: function() {
        return new SocketRoutes();
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
        module("expressServer")
            .properties([
                property("sessionStore").ref("sessionStore")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirBugConfiguration", AirBugConfiguration);
