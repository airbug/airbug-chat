//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.BugCallServer')
//@Require('bugcall.CallServer')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroutes.BugCallRouter')
//@Require('cookies.CookieSigner')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('handshaker.Handshaker')
//@Require('mongo.MongoDataStore')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:server.SocketIoServer')
//@Require('socketio:server.SocketIoServerConfig')

//@Require('airbugserver.RequestContextFactory')
//@Require('airbugserver.SessionStore')

//@Require('airbugserver.ChatMessageController')
//@Require('airbugserver.ConversationController')
//@Require('airbugserver.HomePageController')
//@Require('airbugserver.RoomController')
//@Require('airbugserver.SessionController')
//@Require('airbugserver.UserController')

//@Require('airbugserver.CallService')
//@Require('airbugserver.ChatMessageService')
//@Require('airbugserver.ConversationService')
//@Require('airbugserver.MeldService')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.SessionService')
//@Require('airbugserver.UserService')

//@Require('airbugserver.ChatMessageManager')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.SessionManager')
//@Require('airbugserver.UserManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var express                 = require('express');
var mongoose                = require('mongoose');
var mu2express              = require('mu2express');
var path                    = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var BugCallServer           = bugpack.require('bugcall.BugCallServer');
var CallServer              = bugpack.require('bugcall.CallServer');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var BugCallRouter           = bugpack.require('bugroutes.BugCallRouter');
var CookieSigner            = bugpack.require('cookies.CookieSigner');
var ExpressApp              = bugpack.require('express.ExpressApp');
var ExpressServer           = bugpack.require('express.ExpressServer');
var Handshaker              = bugpack.require('handshaker.Handshaker');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');
var SocketIoServer          = bugpack.require('socketio:server.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('socketio:server.SocketIoServerConfig');

var RequestContextFactory   = bugpack.require('airbugserver.RequestContextFactory');
var SessionStore            = bugpack.require('airbugserver.SessionStore');

var ChatMessageController   = bugpack.require('airbugserver.ChatMessageController');
var ConversationController  = bugpack.require('airbugserver.ConversationController');
var HomePageController      = bugpack.require('airbugserver.HomePageController');
var RoomController          = bugpack.require('airbugserver.RoomController');
var SessionController       = bugpack.require('airbugserver.SessionController');
var UserController          = bugpack.require('airbugserver.UserController');

var CallService             = bugpack.require('airbugserver.CallService');
var ChatMessageService      = bugpack.require('airbugserver.ChatMessageService');
var ConversationService     = bugpack.require('airbugserver.ConversationService');
var MeldService             = bugpack.require('airbugserver.MeldService');
var RoomService             = bugpack.require('airbugserver.RoomService');
var SessionService          = bugpack.require('airbugserver.SessionService');
var UserService             = bugpack.require('airbugserver.UserService');

var ChatMessageManager      = bugpack.require('airbugserver.ChatMessageManager');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
var SessionManager          = bugpack.require('airbugserver.SessionManager');
var UserManager             = bugpack.require('airbugserver.UserManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
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
         * @type {BugCallRouter}
         */
        this._bugCallRouter             = null;

        /**
         * @private
         * @type {BugCallServer}
         */
        this._bugCallServer             = null;

        /**
         * @private
         * @type {CallService}
         */
        this._callService               = null;

        /**
         * @private
         * @type {ChatMessageController}
         */
        this._chatMessageController     = null;

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this._chatMessageManager        = null;

        /**
         * @private
         * @type {ChatMessageService}
         */
        this._chatMessageService        = null;

        /**
         * @private
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         */
        this._config                    = null;

        /**
         * @private
         * @type {string}
         */
        this._configFilePath            = path.resolve(__dirname, '../config.json');

        /**
         * @private
         * @type {ConversationController}
         */
        this._conversationController    = null;

        /**
         * @private
         * @type {ConversationManager}
         */
        this._conversationManager       = null;

        /**
         * @private
         * @type {ConversationService}
         */
        this._conversationService       = null;

        /**
         * @private
         * @type {CookieSigner}
         */
        this._cookieSigner              = null;

        /**
         * @private
         * @type {ExpressApp}
         */
        this._expressApp                = null;

        /**
         * @private
         * @type {ExpressServer}
         */
        this._expressServer             = null;

        /**
         * @private
         * @type {Handshaker}
         */
        this._handshaker                = null;

        /**
         * @private
         * @type {HomePageController}
         */
        this._homePageController        = null;

        /**
         * @private
         * @type {MongoDataStore}
         */
        this._mongoDataStore            = null;

        /**
         * @private
         * @type {RoomManager}
         */
        this._roomManager               = null;

        /**
         * @private
         * @type {RoomService}
         */
        this._roomService               = null;

        /**
         * @private
         * @type {RoomMemberManager}
         */
        this._roomMemberManager         = null;

        /**
         * @private
         * @type {RoomController}
         */
        this._roomController            = null;

        /**
         * @private
         * @type {SessionService}
         */
        this._sessionService            = null;

        /**
         * @private
         * @type {SessionStore}
         */
        this._sessionStore              = null;

        /**
         * @private
         * @type {UserController}
         */
        this._userController            = null;

        /**
         * @private
         * @type {UserManager}
         */
        this._userManager               = null;

        /**
         * @private
         * @type {UserService}
         */
        this._userService               = null;
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
        var sessionKey = 'airbug.sid'; //signedcookie name

        this._cookieSigner.setSecret(secret);

        this._mongoDataStore.connect('mongodb://' + config.mongoDbIp + '/airbug');

        this._expressApp.configure(function(){
            _this._expressApp.engine('mustache', mu2express.engine);
            _this._expressApp.set('view engine', 'mustache');
            _this._expressApp.set('views', path.resolve(__dirname, '../resources/views'));

            _this._expressApp.set('port', config.port);

            _this._expressApp.use(express.cookieParser(secret));
            _this._expressApp.use(express.session({
                cookie: {
                    maxAge: 24 * 60 * 60 * 1000
                },
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

        _this._expressApp.use(express.errorHandler());

        this._expressApp.configure('development', function() {

        });

        //TODO BRN: This setup should be replaced by an annotation
        this._handshaker.addHands([
            this._sessionService,
            this._userService
        ]);

        this._socketIoServerConfig.setResource("/api/socket");

        $series([

            $task(function(flow){
                console.log("Configuring socketIoServer");

                _this._socketIoServer.configure(function(error) {
                    if (!error) {
                        console.log("socketIoServer configured");
                    }
                    flow.complete(error);
                });
            }),

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
            // BugCall
            //-------------------------------------------------------------------------------


            //-------------------------------------------------------------------------------
            // Routers
            //-------------------------------------------------------------------------------

            $task(function(flow) {
                _this._bugCallRouter.initialize(function(error) {
                    if(!error){
                        console.log("bugCallRouter initialized");
                    }
                    flow.complete(error);
                });
            }),

            //-------------------------------------------------------------------------------
            // Controllers
            //-------------------------------------------------------------------------------

            $task([
                _this._chatMessageController.configure();
                console.log("chatMessageController configured");
                _this._conversationController.configure();
                console.log("conversationController configured");
                _this._homePageController.configure();
                console.log("homePageController configured");
                _this._roomController.configure();
                console.log("roomController configured");
                _this._userController.configure();
                console.log("userController configured");
                flow.complete();
            ]),


            //-------------------------------------------------------------------------------
            // Apps and Servers
            //-------------------------------------------------------------------------------

            $task(function(flow) {
                console.log("Initializing expressApp");

                _this._expressApp.initialize(function(error) {
                    if (!error) {
                        console.log("expressApp initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                console.log("starting expressServer");

                _this._expressServer.start(function(error) {
                    if (!error) {
                        console.log("expressServer started");
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
        return new SocketIoManager(socketIoServer, '/api/airbug');
    },

    /**
     * @param {BugCallServer} bugCallRequestEventDispatcher
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallRequestEventDispatcher) {
        this._bugCallRouter = new BugCallRouter(bugCallRequestEventDispatcher);
        return this._bugCallRouter;
    },

    /**
     * @param {CallServer} callServer
     * @return {BugCallServer}
     */
    bugCallServer: function(callServer) {
        this._bugCallServer = new BugCallServer(callServer);
        return this._bugCallServer;
    },

    /**
     * @param {SocketIoManager}
     * @return {CallServer}
     */
    callServer: function(socketIoManager) {
        return new CallServer(socketIoManager);
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @return {CallService}
     */
    callService: function(bugCallServer){
        this._callService = new CallService(bugCallServer);
        return this._callService;
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {ChatMessageService} chatMessageService
     * @return {ChatMessageController}
     */
    chatMessageController: function(bugCallRouter, chatMessageService){
        this._chatMessageController = new ChatMessageController(bugCallRouter, chatMessageService);
        return this._chatMessageController;
    },

    /**
     * @param {MongoDataStore} mongoDataStore
     * @return {ChatMessageManager}
     */
    chatMessageManager: function(mongoDataStore, conversationManager, userManager) {
        this._chatMessageManager = new ChatMessageManager(mongoDataStore, conversationManager, userManager);
        return this._chatMessageManager;
    },

    /**
     * @param {ChatMessageManager} chatMessageManager
     * @param {ConversationManager} conversationManager
     * @param {MeldService} meldService
     * @param {ConversationService} conversationService
     * @param {RoomService} roomService
     * @return {ChatMessageService}
     */
    chatMessageService: function(chatMessageManager, conversationManager, meldService, conversationService, roomService) {
        this._chatMessageService = new ChatMessageService(chatMessageManager, conversationManager, meldService, conversationService, roomService);
        return this._chatMessageService;
    },

    /**
     * @return {Object}
     */
    config: function() {
        this._config = this.loadConfig(this._configFilePath);
        return this._config;
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {ConversationService} conversationService
     * @return {ConversationController}
     */
    conversationController: function(bugCallRouter, conversationService) {
        this._conversationController = new ConversationController(bugCallRouter, conversationService);
        return this._conversationController;
    },

    /**
     * @param {MongoDataStore} mongoDataStore
     * @return {ConversationManager}
     */
    conversationManager: function(mongoDataStore, chatMessageManager) {
        this._conversationManager = new ConversationManager(mongoDataStore, chatMessageManager);
        return this._conversationManager;
    },

    /**
     * @param {ConversationManager} conversationManager
     * @param {MeldService} meldService
     * @return {ConversationService}
     */
    conversationService: function(conversationManager, meldService) {
        this._conversationService = new ConversationService(conversationManager, meldService);
        return this._conversationService;
    },

    /**
     * @return {CookieSigner}
     */
    cookieSigner: function() {
        this._cookieSigner = new CookieSigner();
        return this._cookieSigner;
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
     * @param {MeldManagerFactory} meldManagerFactory
     * @param {MeldBuilder} meldBuilder
     * @param {CallService} callService
     * @return {MeldService}
     */
    meldService: function(meldManagerFactory, meldBuilder, callService) {
        return new MeldService(meldManagerFactory, meldBuilder, callService);
    },

    /**
     * @return {Mongoose}
     */
    mongoose: function() {
        return mongoose;
    },

    /**
     * @param {Mongoose} mongoose
     * @return {MongoDataStore}
     */
    mongoDataStore: function(mongoose) {
        this._mongoDataStore = new MongoDataStore(mongoose);
        return this._mongoDataStore;
    },

    /**
     * @return {RequestContextFactory}
     */
    requestContextFactory: function() {
        return new RequestContextFactory();
    },

    /**
     * @param {MongoDataStore} mongoDataStore
     * @param {ConversationManager} conversationManager
     * @param {RoomMemberManager} roomMemberManager
     * @return {RoomManager}
     */
    roomManager: function(mongoDataStore, conversationManager, roomMemberManager) {
        this._roomManager = new RoomManager(mongoDataStore, conversationManager, roomMemberManager);
        return this._roomManager;
    },

    /**
     * @param {MongoDataStore} mongoDataStore
     * @return {RoomMemberManager}
     */
    roomMemberManager: function(mongoDataStore, roomManager, userManager) {
        this._roomMemberManager = new RoomMemberManager(mongoDataStore, roomManager, userManager);
        return this._roomMemberManager;
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {RoomService} roomService
     * @param {RequestContextFactory} requestContextFactory
     * @return {RoomController}
     */
    roomController: function(bugCallRouter, roomService, requestContextFactory) {
        this._roomController = new RoomController(bugCallRouter, roomService, requestContextFactory);
        return this._roomController;
    },

    /**
     * @param {RoomManager} roomManager
     * @param {UserManager} userManager
     * @param {RoomMemberManager} roomMemberManager
     * @param {MeldService} meldService
     * @return {RoomService}
     */
    roomService: function(roomManager, userManager, roomMemberManager, meldService) {
        this._roomService = new RoomService(roomManager, userManager, roomMemberManager, meldService);
        return this._roomService;
    },

    /**
     * @param {ExpressApp} expressApp
     * @param {SocketRouter} bugCallRouter
     * @param {SessionService} sessionService
     * @param {RequestContextFactory} requestContextFactory
     * @return {UserController}
     */
    sessionController: function(expressApp, bugCallRouter, sessionService, requestContextFactory){
        return new SessionController(config, expressApp, bugCallRouter, sessionService, requestContextFactory);
    };

    /**
     * @param {MongoDataStore} mongoDataStore
     * @return {SessionManager}
     */
    sessionManager: function(mongoDataStore) {
        return new SessionManager(mongoDataStore);
    },

    /**
     * @param {CookieSigner} cookieSigner
     * @param {SessionManager} sessionManager
     * @return {SessionService}
     */
    sessionService: function(cookieSigner, sessionManager) {
        this._sessionService = new SessionService(cookieSigner, sessionManager);
        return this._sessionService;
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
     * @param {Object} config
     * @param {ExpressApp} expressApp
     * @param {SocketRouter} bugCallRouter
     * @param {UserService} userService
     * @param {SessionService} sessionService
     * @param {RequestContextFactory} requestContextFactory
     * @return {UserController}
     */
    userController: function(config, expressApp, bugCallServer, bugCallRouter, userService, sessionService, requestContextFactory) {
        this._userController = new UserController(config, expressApp, bugCallServer, bugCallRouter, userService, sessionService, requestContextFactory);
        return this._userController;
    },

    /**
     * @param {MongoDataStore} mongoDataStore
     * @return {UserManager}
     */
    userManager: function(mongoDataStore, roomManager) {
        this._userManager = new UserManager(mongoDataStore, roomManager);
        return this._userManager;
    },

    /**
     * @param {SessionManager} sessionManager
     * @param {UserManager} userManager
     * @return {UserService}
     */
    userService: function(sessionManager, userManager) {
        this._userService = new UserService(sessionManager, userManager);
        return this._userService;
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
        var config = {
            port: 8000,
            mongoDbIp: "localhost"
        };

        if (BugFs.existsSync(configPath)) {
            try {
                config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
            } catch(error) {
                console.log(configPath, "could not be parsed. Invalid JSON.");
            }
            return config;
        } else {
            return config;
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirbugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugServerConfiguration).with(
    configuration().modules([
        
        //-------------------------------------------------------------------------------
        // AirBugServer
        //-------------------------------------------------------------------------------

        module("mongoose"),
        module("mongoDataStore")
            .args([
                arg().ref("mongoose")
            ]),
        module("requestContextFactory"),


        //-------------------------------------------------------------------------------
        // Config
        //-------------------------------------------------------------------------------

        module("config"),


        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------

        module("expressApp")
            .args([
                arg().ref("config")
            ])
            .properties([
                property("sessionStore").ref("sessionStore")
            ]),
        module("expressServer")
            .args([
                arg().ref("expressApp")
            ]),
        module("sessionStore")
            .args([
                arg().ref("sessionManager")
            ]),


        //-------------------------------------------------------------------------------
        // Util
        //-------------------------------------------------------------------------------

        module("cookieSigner"),
        module("handshaker"),


        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------

        module("apiAirbugSocketIoManager")
            .args([
                arg().ref("socketIoServer")
            ]),
        module("socketIoServer").
            args([
                arg().ref("socketIoServerConfig"),
                arg().ref("expressServer"),
                arg().ref("handshaker")
            ]),
        module("socketIoServerConfig"),


        //-------------------------------------------------------------------------------
        // BugCall
        //-------------------------------------------------------------------------------

        module("bugCallRouter")
            .args([
                arg().ref("bugCallServer")
            ]),
        module("bugCallServer")
            .args([
                arg().ref("callServer")
            ]),
        module("callServer")
            .args([
                arg().ref("apiAirbugSocketIoManager")
            ]),



        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------

        module("chatMessageController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("chatMessageService"),
                arg().ref("requestContextFactory")
            ]),
        module("conversationController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("conversationService"),
                arg().ref("requestContextFactory")
            ]),
        module("homePageController")
            .args([
                arg().ref("config"),
                arg().ref("expressApp")
            ]),
        module("roomController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("roomService"),
                arg().ref("requestContextFactory")
            ]),
        module("sessionController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("sessionService"),
                arg().ref("requestContextFactory")
            ]),
        module("userController")
            .args([
                arg().ref("config"),
                arg().ref("expressApp"),
                arg().ref("bugCallServer"),
                arg().ref("bugCallRouter"),
                arg().ref("userService"),
                arg().ref("sessionService"),
                arg().ref("requestContextFactory")
            ]),


       //-------------------------------------------------------------------------------
        // Services
        //-------------------------------------------------------------------------------

        module("chatMessageService")
            .args([
                arg().ref("chatMessageManager"),
                arg().ref("conversationManager"),
                arg().ref("meldService"),
                arg().ref("conversationService"),
                arg().ref("roomService")
            ]),
        module("callService")
            .args([
                arg().ref("bugCallServer")
            ]),
        module("conversationService")
            .args([
                arg().ref("conversationManager"),
                arg().ref("meldService")
            ]),
        module("meldService")
            .args([
                arg().ref("meldManagerFactory"),
                arg().ref("meldBuilder"),
                arg().ref("callService")
            ]),
        module("roomService")
            .args([
                arg().ref("roomManager"),
                arg().ref("userManager"),
                arg().ref("roomMemberManager"),
                arg().ref("meldService")
            ]),
        module("sessionService")
            .args([
                arg().ref("cookieSigner"),
                arg().ref("sessionManager")
            ]),
        module("userService")
            .args([
                arg().ref("sessionManager"),
                arg().ref("userManager")
            ]),


        //-------------------------------------------------------------------------------
        // ModelManagers
        //-------------------------------------------------------------------------------

        module("chatMessageManager")
            .args([
                arg().ref("mongoDataStore"),
                arg().ref("conversationManager"),
                arg().ref("userManager")
            ]),
        module("conversationManager")
            .args([
                arg().ref("mongoDataStore"),
                arg().ref("chatMessageManager")
            ]),
        module("roomManager")
            .args([
                arg().ref("mongoDataStore"),
                arg().ref("conversationManager"),
                arg().ref("roomMemberManager")
            ]),
        module("roomMemberManager")
            .args([
                arg().ref("mongoDataStore"),
                arg().ref("roomManager"),
                arg().ref("userManager")
            ]),
        module("sessionManager")
            .args([
                arg().ref("mongoDataStore")
            ]),
        module("userManager")
            .args([
                arg().ref("mongoDataStore"),
                arg().ref("roomManager")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugServerConfiguration", AirbugServerConfiguration);
