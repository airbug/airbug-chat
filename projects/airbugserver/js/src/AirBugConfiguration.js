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

        /**
         * @private
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         */
        this._config = null;

        /**
         * @type {string}
         */
        this._configFilePath = null;
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

    config: function(){
        this._configFilePath = path.resolve(__dirname, '../config.json');
        this._config = this.loadConfig(this.configFilePath);
        return this._config;
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
        return new ExpressApp().initialize();
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

    /**
     * @return {Mongoose}
     */
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
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {?string=} configPath
     * @return {{
     *      port: number,
     *      mongoDbIp: string
     * }}
     **/
    loadConfig: function(configPath){
        var config;
        var defaults = {
            port: 8000,
            mongoDbIp: "localhost"
        };

        if (BugFs.existsSync(configPath)) {
            try {
                config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
            } catch(error) {
                    console.log(configPath, "could not be parsed. Invalid JSON.");
                    console.log(AirBugServer, "config set to defaults.");
                    return defaults;
            } finally {
                return config;
            }
        } else {
            return defaults;
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirBugConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// Annotate
//-------------------------------------------------------------------------------

annotate(AirBugConfiguration).with(
    configuration().modules([
        
        //-------------------------------------------------------------------------------
        // AirBugServer
        //-------------------------------------------------------------------------------
        module("airBugServer")
            .properties([
                property("config").ref("config"),
                property("expressServer").ref("expressServer"),
                property("mongoose").ref("mongoose"),
                property("socketManager").ref("socketManager")
            ]),

        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------
        module("expressApp")
            .properties([
                property("config").ref("config"),
                property("expressRoutes").ref("expressRoutes"),
                property("sessionStore").ref("sessionStore")
            ]),
        module("expressRoutes"),
        module("expressServer"),

        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------
        module("socketManager")
            .properties([
                property("server").ref("expressServer"),
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
