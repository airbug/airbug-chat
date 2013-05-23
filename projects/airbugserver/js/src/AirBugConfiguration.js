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
//@Require('airbugserver.ApplicationController')
//@Require('airbugserver.ExpressApp')
//@Require('airbugserver.ExpressServer')
//@Require('airbugserver.ExpressRoutes')
//@Require('airbugserver.SocketIoManager')
//@Require('airbugserver.SocketRoutes')
//@Require('airbugserver.SocketsMap')
//@Require('airbugserver.ChatMessageApi')
//@Require('airbugserver.ConversationApi')
//@Require('airbugserver.RoomApi')
//@Require('airbugserver.UserApi')

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

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Annotate                = bugpack.require('annotate.Annotate');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var RoutesManager           = bugpack.require('bugroutes.RoutesManager');

var ApplicationController   = bugpack.require('airbugserver.ApplicationController');
var AirBugServer            = bugpack.require('airbugserver.AirBugServer');
var ExpressApp              = bugpack.require('airbugserver.ExpressApp');
var ExpressServer           = bugpack.require('airbugserver.ExpressServer');
var ExpressRoutes           = bugpack.require('airbugserver.ExpressRoutes');
var SocketIoManager         = bugpack.require('airbugserver.SocketIoManager');
var SocketIoServer          = bugpack.require('airbugserver.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('airbugserver.SocketIoServerConfig');
var SocketRoutes            = bugpack.require('airbugserver.SocketRoutes');
var SocketsMap              = bugpack.require('airbugserver.SocketsMap');

var ChatMessageApi          = bugpack.require('airbugserver.ChatMessageApi');
var ConversationApi         = bugpack.require('airbugserver.ConversationApi');
var RoomApi                 = bugpack.require('airbugserver.RoomApi');
var UserApi                 = bugpack.require('airbugserver.UserApi');

var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var Conversation            = bugpack.require('airbugserver.Conversation');
var Room                    = bugpack.require('airbugserver.Room');
var User                    = bugpack.require('airbugserver.User');

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
        this._configFilePath = path.resolve(__dirname, '../config.json');

        /**
         * @type {ExpressApp}
         */
        this._expressApp = null;

        /**
         * @type {ExpressServer}
         */
        this._expressServer = null;

        /**
         * @type {SocketIoManager}
         */
        this._socketIoManager = null;

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
                console.log("Starting socketIoServer");

                _this._socketIoServer.start(function(error){
                    if(!error){
                        console.log("socketIoServer started");
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

    alphaSocketIoManager: function(socketIoServer, socketsMap){
        return new SocketIoManager(socketIoServer, '/alpha', socketsMap);
    },

    /**
     * @return {ApplicationController}
     */
    applicationController: function(roomApi, userApi, socketIoManager, socketsMap){
        return new ApplicationController(roomApi, userApi, socketIoManager, socketsMap);
    },

    /**
     * @return {AirBugServer}
     */
    airBugServer: function() {
        this._airBugServer = new AirBugServer();
        return this._airBugServer;
    },

    /**
     * @return {ChatMessage}
     */
    chatMessage: function(){
        return ChatMessage;
    },

    /**
     * @return {ChatMessageApi}
     */
    chatMessageApi: function(model){
        return new ChatMessageApi(model);
    },

    /**
     * @return {}
     */
    config: function(){
        this._config = this.loadConfig(this._configFilePath);
        return this._config;
    },

    /**
     * @return {Conversation}
     */
    conversation: function(){
        return Conversation;
    },

    /**
     * @return {ConversationApi}
     */
    conversationApi: function(model){
        return new ConversationApi(model);
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
     * @return {RoutesManager}
     */
    expressRoutesManager: function(app, routes){
        return new RoutesManager(app, routes);
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
     * @return {Room}
     */
    room: function(){
        return Room;
    },

    /**
     * @return {RoomApi}
     */
    roomApi: function(model){
        return new RoomApi(model);
    },

    /**
     * @return {MemoryStore}
     */
    sessionStore: function(){
        return new connect.middleware.session.MemoryStore();
    },

    socketIoServer: function(config, expressServer){
        this._socketIoServer = new SocketIoServer(config, expressServer);
        return this._socketIoServer;
    },

    socketIoServerConfig: function(){
        return new SocketIoServerConfig({});
    },

    /**
     * @return {SocketIoManager}
     */
    socketIoManager: function() {
        this._socketIoManager = new SocketIoManager();
        return this._socketIoManager;
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
     * @return {User}
     */
    user: function(){
        return User;
    },

    /**
     * @return {UserApi}
     */
    userApi: function(model){
        return new UserApi(model);
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
                property("socketIoManager").ref("socketIoManager")
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
        module("expressRoutesManager")
            .args([
                arg("app").ref("expressApp"),
                arg("routes").ref("expressRoutes")
            ])
        module("expressRoutes"),
        module("expressServer")
            .args([
                arg("expressApp").ref("expressApp")
            ]),
        module("sessionStore"),

        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------
        module("socketIoServer").
            args([
                arg("config").ref("socketIoServerConfig"),
                arg("expressServer").ref("expressServer")
            ]),
        module("socketIoServerConfig"),
        module("alphaSocketIoManager")
            .args([
                arg("socketIoServer").ref("socketIoServer"),
                arg("socketsMap").ref("socketsMap")
            ]),
        module("socketsMap"),
        module("socketRoutes"),


        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------
        module("applicationController")
            .args([
                arg("roomApi").ref("roomApi"),
                arg("userApi").ref("userApi"),
                arg("socketIoManager").ref("socketIoManager"),
                arg("socketsMap").ref("socketsMap")
            ]),
        //-------------------------------------------------------------------------------
        // Apis
        //-------------------------------------------------------------------------------
        module("chatMessageApi")
            .args([
                arg("model").ref("chatMessage")
            ]),
        module("conversationApi")
            .args([
                arg("model").ref("coversation")
            ]),
        module("roomApi")
            .args([
                arg("model").ref("room")
            ]),
        module("userApi")
            .args([
                arg("model").ref("user")
            ]),
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirBugConfiguration", AirBugConfiguration);
