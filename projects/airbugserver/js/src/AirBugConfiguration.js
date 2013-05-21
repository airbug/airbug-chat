//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirBugConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')

//@Require('airbugserver.AirBugServer')
//@Require('airbugserver.ExpressApp')
//@Require('airbugserver.ExpressServer')
//@Require('airbugserver.ExpressRoutes')
//@Require('airbugserver.SocketManager')
//@Require('airbugserver.SocketRoutes')
//@Require('airbugserver.SocketsMap')
//@Require('airbugserver.ChatMessagesApi')
//@Require('airbugserver.ConversationsApi')
//@Require('airbugserver.RoomsApi')
//@Require('airbugserver.UsersApi')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var mongoose                = require('mongoose');
var path                    = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Annotate                = bugpack.require('annotate.Annotate');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');

var AirBugServer            = bugpack.require('airbugserver.AirBugServer');
var ExpressApp              = bugpack.require('airbugserver.ExpressApp');
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

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


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
        this._configFilePath = path.resolve(__dirname, '../config.json');;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeConfiguration: function() {
        var _this = this;
        console.log("Initializing AirBugConfiguration");
        $series([
            $task(function(flow){
                console.log("Initializing expressApp");

                _this._expressApp.initialize(function(error){
                    if(!error){
                        console.log("expressApp initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("starting expressServer");

                _this._expressServer.start(function(error){
                    if(!error){
                        console.log("expressServer started");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("Initializing socketManager");

                _this._socketManager.initialize(function(error){
                    if(!error){
                        console.log("socketManager initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("Initializing airBugServer");

                _this._airBugServer.start(function(error){
                    if(!error){
                        console.log("airBugServer initialized");
                    }
                    flow.complete(error);
                });
            }),
        ]).execute(function(error){
            if(!error){
                console.log("AirBugConfiguration successfully initialized.")
            } else {
                console.log(error);
            }
        });
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

    /**
     * @return {}
     */
    config: function(){
        this._config = this.loadConfig(this._configFilePath);
        return this._config;
    },

    /**
     * @return {ConversationsApi}
     */
    conversationsApi: function(){
        return new ConversationsApi();
    },

    /**
     * @return {ExpressServer}
     */
    expressApp: function(config) {
        this._expressApp = new ExpressApp(config);
        return this._expressApp;
    },

    /**
     * @return {ExpressRoutes}
     */
    expressRoutes: function() {
        return ExpressRoutes;
    },

    /**
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        this._expressServer = new ExpressServer(expressApp);
        return this._expressServer;
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
    roomsApi: function(){
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
        this._socketManager = new SocketManager();
        return this._socketManager;
    },

    /**
     * @return {SocketRoutes}
     */
    socketRoutes: function() {
        return SocketRoutes;
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
        module("mongoose"),

        //-------------------------------------------------------------------------------
        // Common Config Object
        //-------------------------------------------------------------------------------
        module("config"),

        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------
        module("expressApp")
            .args([
                arg("config").ref("config")
            ])
            .properties([
                property("expressRoutes").ref("expressRoutes"),
                property("sessionStore").ref("sessionStore")
            ]),
        module("expressRoutes"),
        module("expressServer")
            .args([
                arg("expressApp").ref("expressApp")
            ]),
        module("sessionStore"),

        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------
        module("socketManager")
            .properties([
                property("expressServer").ref("expressServer"),
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

// module("minerbugWorkerSocketManager")
//     .args([
//         arg("socketIoServer").ref("socketIoServer")
//     ]),
// module("socketIoServer").
//     args([
//         arg("config").ref("socketIoServerConfig"),
//         arg("expressServer").ref("expressServer")
//     ]),


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirBugConfiguration", AirBugConfiguration);
