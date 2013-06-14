//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('annotate.Annotate')
//@Require('bugcall.BugCallServer')
//@Require('bugcall.CallServer')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugroutes.BugCallRoutes')
//@Require('bugroutes.SocketRouter')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('handshaker.Handshaker')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:server.SocketIoServer')
//@Require('socketio:server.SocketIoServerConfig')

//@Require('airbugserver.SessionStore')

//@Require('airbugserver.HomePageController')
//@Require('airbugserver.RoomController')
//@Require('airbugserver.UserController')

//@Require('airbugserver.RoomService')
//@Require('airbugserver.SessionService')
//@Require('airbugserver.UserService')

//@Require('airbugserver.ChatMessageManager')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.SessionManager')
//@Require('airbugserver.UserManager')

//@Require('airbugserver.ChatMessage')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.Dialogue')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.Room')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')

//@Require('airbugserver.ChatMessageSchema')
//@Require('airbugserver.ConversationSchema')
//@Require('airbugserver.DialogueSchema')
//@Require('airbugserver.RoomMemberSchema')
//@Require('airbugserver.RoomSchema')
//@Require('airbugserver.SessionSchema')
//@Require('airbugserver.UserSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var express                 = require('express');
var mongoose                = require('mongoose');
var mu2express              = require("mu2express");
var path                    = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Annotate                = bugpack.require('annotate.Annotate');
var BugCallServer           = bugpack.require('bugcall.BugCallServer');
var CallServer              = bugpack.require('bugcall.CallServer');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugCallRouter           = BugPack.require('bugroutes.BugCallRouter');
var SocketRouter            = bugpack.require('bugroutes.SocketRouter');
var ExpressApp              = bugpack.require('express.ExpressApp');
var ExpressServer           = bugpack.require('express.ExpressServer');
var Handshaker              = bugpack.require('handshaker.Handshaker');
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');
var SocketIoServer          = bugpack.require('socketio:server.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('socketio:server.SocketIoServerConfig');

var SessionStore            = bugpack.require('airbugserver.SessionStore');

var HomePageController      = bugpack.require('airbugserver.HomePageController');
var RoomController          = bugpack.require('airbugserver.RoomController');
var UserController          = bugpack.require('airbugserver.UserController');

var SessionService          = bugpack.require('airbugserver.SessionService');
var RoomService             = bugpack.require('airbugserver.RoomService');
var UserService             = bugpack.require('airbugserver.UserService');

var ChatMessageManager      = bugpack.require('airbugserver.ChatMessageManager');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
var SessionManager          = bugpack.require('airbugserver.SessionManager');
var UserManager             = bugpack.require('airbugserver.UserManager');

var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var Conversation            = bugpack.require('airbugserver.Conversation');
var Dialogue                = bugpack.require('airbugserver.Dialogue');
var Room                    = bugpack.require('airbugserver.Room');
var RoomMember              = bugpack.require('airbugserver.RoomMember');
var Session                 = bugpack.require('airbugserver.Session');
var User                    = bugpack.require('airbugserver.User');

var ChatMessageSchema       = bugpack.require('airbugserver.ChatMessageSchema');
var ConversationSchema      = bugpack.require('airbugserver.ConversationSchema');
var DialogueSchema          = bugpack.require('airbugserver.DialogueSchema');
var RoomMemberSchema        = bugpack.require('airbugserver.RoomMemberSchema');
var RoomSchema              = bugpack.require('airbugserver.RoomSchema');
var SessionSchema           = bugpack.require('airbugserver.SessionSchema');
var UserSchema              = bugpack.require('airbugserver.UserSchema');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate                = Annotate.annotate;
var arg                     = ArgAnnotation.arg;
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;

var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugServerConfiguration = Class.extend(Obj, {

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
         * @type {SocketIoManager}
         */
        this._apiAirbugSocketIoManager  = null;

        /**
         * @private
         * @type {BugCallRouter}
         */
        this._bugCallRouter         = null;

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this._chatMessageManager    = null;

        /**
         * @private
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         */
        this._config                = null;

        /**
         * @private
         * @type {string}
         */
        this._configFilePath        = path.resolve(__dirname, '../config.json');

        /**
         * @private
         * @type {ConversationManager}
         */
        this._conversationManager   = null;

        /**
         * @private
         * @type {ExpressApp}
         */
        this._expressApp            = null;

        /**
         * @private
         * @type {ExpressServer}
         */
        this._expressServer         = null;

        /**
         * @private
         * @type {Handshaker}
         */
        this._handshaker            = null;

        /**
         * @private
         * @type {HomePageController}
         */
        this._homePageController =  null;

        /**
         * @private
         * @type {RoomManager}
         */
        this._roomManager           = null;

        /**
         * @private
         * @type {RoomMemberManager}
         */
        this._roomMemberManager     = null;

        /**
         * @private
         * @type {RoomController}
         */
        this._roomController        = null;

        /**
         * @private
         * @type {SessionStore}
         */
        this._sessionStore          = null;

        /**
         * @private
         * @type {SocketRouter}
         */
        this._socketRouter   = null;

        /**
         * @private
         * @type {UserManager}
         */
        this._userManager           = null;

        /**
         * @private
         * @type {UserController}
         */
        this._userController       = null;

    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing AirbugConfiguration");

        var config = this._config;
        var secret = 'some secret'; // LOAD FROM CONFIG;
        var sessionKey = 'express.sid';

        this._expressApp.configure(function(){
            _this._expressApp.engine('mustache', mu2express.engine);
            _this._expressApp.set('view engine', 'mustache');
            _this._expressApp.set('views', path.resolve(__dirname, '../resources/views'));

            _this._expressApp.set('port', config.port);

            /*app.set('view engine', 'jade');*/

            _this._expressApp.use(express.cookieParser());
            _this._expressApp.use(express.session({
                store: _this._sessionStore,
                secret: secret,
                key: sessionKey
            }));
            _this._expressApp.use(express.favicon(path.resolve(__dirname, '../static/img/airbug-icon.png')));
            _this._expressApp.use(express.logger('dev'));
            _this._expressApp.use(express.bodyParser());
            _this._expressApp.use(express.methodOverride()); // put and delete support for html 4 and older
            _this._expressApp.use(express.static(path.resolve(__dirname, '../static')));
            _this._expressApp.use(_this._expressApp.getApp().router);
        });

        this._expressApp.configure('development', function() {
            _this._expressApp.use(express.errorHandler());
        });

        this._mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

        //TODO BRN: This setup should be replaced by an annotation
        this._handshaker.addHands([
            this.sessionService,
            this.userService
        ]);

        this._socketIoServerConfig.setResource("/api/socket");

        $series([

            //-------------------------------------------------------------------------------
            // Model Managers
            //-------------------------------------------------------------------------------

            $parallel([
                $task(function(flow) {
                    _this._chatMessageManager.configure(function(error) {
                        if (!error) {
                            console.log("chatMessageManager configured");
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._conversationManager.configure(function(error) {
                        if (!error) {
                            console.log("conversationManager configured");
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._roomManager.configure(function(error) {
                        if (!error) {
                            console.log("roomManager configured");
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._roomMemberManager.configure(function(error) {
                        if (!error) {
                            console.log("roomMemberManager configured");
                        }
                        flow.complete(error);
                    });
                }),
                $task(function(flow) {
                    _this._userManager.configure(function(error) {
                        if (!error) {
                            console.log("userManager configured");
                        }
                        flow.complete(error);
                    });
                })
            ]),


            //-------------------------------------------------------------------------------
            // Services
            //-------------------------------------------------------------------------------

            //-------------------------------------------------------------------------------
            // RoutesManagers
            //-------------------------------------------------------------------------------

            $task(function(flow){
                _this._socketRouter.initialize(function(error) {
                    if (!error) {
                        console.log("socketRouter initialized");
                    }
                    flow.complete(error);
                });
            }),


            //-------------------------------------------------------------------------------
            // Controllers
            //-------------------------------------------------------------------------------

            $parallel([
                $task(function(flow){
                    _this._homePageController.configure(function(error) {
                        if (!error) {
                            console.log("homePageController configured");
                        }
                        flow.complete(error);
                    })
                }),
                $task(function(flow){
                    _this._roomController.configure(function(error) {
                        if (!error) {
                            console.log("roomController configured");
                        }
                        flow.complete(error);
                    })
                }),
                $task(function(flow){
                    _this._userController.configure(function(error){
                        if (!error) {
                            console.log("userController configured");
                        }
                        flow.complete(error);
                    })
                })
            ]),


            //-------------------------------------------------------------------------------
            // Apps and Servers
            //-------------------------------------------------------------------------------

            $task(function(flow){
                console.log("Initializing expressApp");

                _this._expressApp.initialize(function(error) {
                    if (!error) {
                        console.log("expressApp initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("starting expressServer");

                _this._expressServer.start(function(error) {
                    if (!error) {
                        console.log("expressServer started");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("Starting socketIoServer");

                _this._socketIoServer.start(function(error) {
                    if (!error) {
                        console.log("socketIoServer started");
                    }
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {SocketIoServer} socketIoServer
     * @return {SocketIoManager}
     */
    apiAirbugSocketIoManager: function(socketIoServer) {
        this._apiAirbugSocketIoManager = new SocketIoManager(socketIoServer, '/api/airbug');
        return this._apiAirbugSocketIoManager;
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallServer) {
        this._bugCallRouter = new BugCallRouter(bugCallServer);
        return this._bugCallRouter;
    },

    /**
     * @param {CallServer} callServer
     * @return {BugCallServer}
     */
    bugCallServer: function(callServer) {
        return new BugCallServer(callServer);
    },

    /**
     * @param {SocketIoManager}
     * @return {CallServer}
     */
    callServer: function(socketIoManager) {
        return new CallServer(socketIoManager);
    },

    /**
     * @return {ChatMessage}
     */
    chatMessage: function() {
        return ChatMessage;
    },

    /**
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {ChatMessageManager}
     */
    chatMessageManager: function(model, schema) {
        this._chatMessageManager = new ChatMessageManager(model, schema);
        return this._chatMessageManager;
    },

    /**
     * @return {ChatMessageSchema}
     */
    chatMessageSchema: function() {
        return ChatMessageSchema;
    },

    /**
     * @return {Object}
     */
    config: function() {
        this._config = this.loadConfig(this._configFilePath);
        return this._config;
    },

    /**
     * @return {Conversation}
     */
    conversation: function() {
        return Conversation;
    },

    /**
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {ConversationManager}
     */
    conversationManager: function(model, schema) {
        this._conversationManager = new ConversationManager(model, schema);
        return this._conversationManager;
    },

    /**
     * @return {ConversationSchema}
     */
    conversationSchema: function() {
        return ConversationSchema;
    },

    /**
     * @return {Dialogue}
     */
    dialogue: function() {
        return Dialogue;
    },

    /**
     * @return {DialogueSchema}
     */
    dialogueSchema: function() {
        return DialogueSchema;
    },

    /**
     * @param {Object} config
     * @return {ExpressServer}
     */
    expressApp: function(config) {
        this._expressApp = new ExpressApp(config);
        return this._expressApp;
    },

    /**
     * @param {ExpressApp} expressApp
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        this._expressServer = new ExpressServer(expressApp);
        return this._expressServer;
    },

    /**
     * @return {Handshaker}
     */
    handshaker: function() {
        this._handshaker = new Handshaker([]);
        return this._handshaker;
    },

    /**
     * @param {Object} config
     * @param {ExpressApp} expressApp
     * @return {HomePageController}
     */
    homePageController: function(config, expressApp) {
        this._homePageController = new HomePageController(config, expressApp);
        return this._homePageController;
    },

    /**
     * @return {Mongoose}
     */
    mongoose: function() {
        this._mongoose = mongoose;
        return this._mongoose;
    },

    /**
     * @return {Room}
     */
    room: function() {
        return Room;
    },

    /**
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {RoomManager}
     */
    roomManager: function(model, schema) {
        this._roomManager = new RoomManager(model, schema);
        return this._roomManager;
    },

    /**
     * @return {RoomMember}
     */
    roomMember: function() {
        return RoomMember;
    },

    /**
     * @param {RoomMember} model
     * @param {RoomMemberSchema} schema
     * @return {RoomMemberManager}
     */
    roomMemberManager: function(model, schema) {
        this._roomMemberManager = new RoomMemberManager(model, schema);
        return this._roomMemberManager;
    },

    /**
     * @return {RoomMemberSchema}
     */
    roomMemberSchema: function() {
        return RoomMemberSchema;
    },

    /**
     * @param {SocketRouter} socketRouter
     * @param {RoomService} roomService
     * @return {RoomController}
     */
    roomController: function(socketRouter, roomService) {
        this._roomController = new RoomController(socketRouter, roomService);
        return this._roomController;
    },

    /**
     * @return {RoomSchema}
     */
    roomSchema: function() {
        return RoomSchema;
    },

    /**
     * @param {RoomManager} roomManager
     * @param {UserManager} userManager
     * @return {RoomService}
     */
    roomService: function(roomManager, userManager) {
        return new RoomService(roomManager, userManager);
    },

    /**
     * @return {Session}
     */
    session: function() {
        return Session;
    },

    /**
     * @param {Session} model
     * @param {SessionSchema} schema
     * @return {SessionManager}
     */
    sessionManager: function(model, schema) {
        return new SessionManager(model, schema);
    },

    /**
     * @return {SessionSchema}
     */
    sessionSchema: function() {
        return SessionSchema;
    },

    /**
     * @param {SessionManager} sessionManager
     * @return {SessionService}
     */
    sessionService: function(sessionManager) {
        return new SessionService(sessionManager);
    },

    /**
     * @param {SessionManager} sessionManager
     * @return {SessionStore}
     */
    sessionStore: function(sessionManager) {
        this._sessionStore = new SessionStore(sessionManager);
        return this._sessionStore;
    },

    /**
     * @param {SocketIoServerConfig} config
     * @param {ExpressServer} expressServer
     * @return {SocketIoServer}
     */
    socketIoServer: function(config, expressServer, handshaker) {
        this._socketIoServer = new SocketIoServer(config, expressServer, handshaker);
        return this._socketIoServer;
    },

    /**
     * @return {SocketIoServerConfig}
     */
    socketIoServerConfig: function() {
        this._socketIoServerConfig = new SocketIoServerConfig({});
        return this._socketIoServerConfig;
    },

    /**
     * @param {SocketIoManager} ioManager
     * @return {SocketRouter}
     */
    socketRouter: function(ioManager) {
        this._socketRouter = new SocketRouter(ioManager);
        return this._socketRouter;
    },

    /**
     * @return {User}
     */
    user: function() {
        return User;
    },

    /**
     * @param {SocketRouter} socketRouter
     * @param {UserService} userService
     * @return {UserController}
     */
    userController: function(socketRouter, userService) {
        this._userController = new UserController(socketRouter, userService);
        return this._userController;
    },

    /**
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {UserManager}
     */
    userManager: function(model, schema) {
        this._userManager = new UserManager(model, schema);
        return this._userManager;
    },

    /**
     * @return {UserSchema}
     */
    userSchema: function() {
        return UserSchema;
    },

    /**
     * @param {UserManager} userManager
     * @return {UserService}
     */
    userService: function(userManager) {
        return new UserService(userManager);
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

Class.implement(AirbugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// Annotate
//-------------------------------------------------------------------------------

annotate(AirbugServerConfiguration).with(
    configuration().modules([
        
        //-------------------------------------------------------------------------------
        // AirBugServer
        //-------------------------------------------------------------------------------

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
                property("sessionStore").ref("sessionStore")
            ]),
        module("expressServer")
            .args([
                arg("expressApp").ref("expressApp")
            ]),
        module("sessionStore")
            .args([
                arg("sessionManager").ref("sessionManager")
            ]),


        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------

        module("handshaker"),
        module("apiAirbugSocketIoManager")
            .args([
                arg("socketIoServer").ref("socketIoServer")
            ]),
        module("socketRouter")
            .args([
                arg("ioManager").ref("apiAirbugSocketIoManager")
            ]),
        module("socketIoServer").
            args([
                arg("config").ref("socketIoServerConfig"),
                arg("expressServer").ref("expressServer"),
                arg("handshaker").ref("handshaker")
            ]),
        module("socketIoServerConfig"),


        //-------------------------------------------------------------------------------
        // BugCall
        //-------------------------------------------------------------------------------

        module("bugCallRouter")
            .args([
                arg("bugCallServer").ref("bugCallServer")
            ]),
        module("bugCallServer")
            .args([
                arg("callServer").ref("callServer")
            ]),
        module("callServer")
            .args([
                arg("socketIoManager").ref("apiAirbugSocketIoManager")
            ]),


        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------

        module("homePageController")
            .args([
                arg("config").ref("config"),
                arg("expressApp").ref("expressApp")
            ]),
        module("roomController")
            .args([
                arg("bugCallRouter").ref("bugCallRouter"),
                arg("roomService").ref("roomService")
            ]),
        module("userController")
            .args([
                arg("bugCallRouter").ref("bugCallRouter"),
                arg("userService").ref("userService")
            ]),


        //-------------------------------------------------------------------------------
        // ModelManagers
        //-------------------------------------------------------------------------------

        module("chatMessageManager")
            .args([
                arg("model").ref("chatMessage"),
                arg("schema").ref("chatMessageSchema")
            ]),
        module("conversationManager")
            .args([
                arg("model").ref("conversation"),
                arg("schema").ref("conversationSchema")
            ]),
        module("roomManager")
            .args([
                arg("model").ref("room"),
                arg("schema").ref("roomSchema")
            ]),
        module("roomMemberManager")
            .args([
                arg("model").ref("roomMember"),
                arg("schema").ref("roomMemberSchema")
            ]),
        module("sessionManager")
            .args([
                arg("model").ref("session"),
                arg("schema").ref("sessionSchema")
            ]),
        module("userManager")
            .args([
                arg("model").ref("user"),
                arg("schema").ref("userSchema")
            ]),


        //-------------------------------------------------------------------------------
        // Services
        //-------------------------------------------------------------------------------

        module("roomService")
            .args([
                arg("roomManager").ref("roomManager"),
                arg("userManager").ref("userManager")
            ]),
        module("sessionService")
            .args([
                arg("sessionManager").ref("sessionManager")
            ]),
        module("userService")
            .args([
                arg("userManager").ref("userManager")
            ]),


        //-------------------------------------------------------------------------------
        // Models
        //-------------------------------------------------------------------------------

        module("chatMessage"),
        module("conversation"),
        module("dialogue"),
        module("room"),
        module("roomMember"),
        module("session"),
        module("user"),


        //-------------------------------------------------------------------------------
        // Schemas
        //-------------------------------------------------------------------------------

        module("chatMessageSchema"),
        module("conversationSchema"),
        module("dialogueSchema"),
        module("roomMemberSchema"),
        module("roomSchema"),
        module("sessionSchema"),
        module("userSchema")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugServerConfiguration", AirbugServerConfiguration);
