//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugClientConfig')
//@Require('airbugserver.CallService')
//@Require('airbugserver.ChatMessageController')
//@Require('airbugserver.ChatMessageService')
//@Require('airbugserver.ConversationController')
//@Require('airbugserver.ConversationService')
//@Require('airbugserver.GithubApi')
//@Require('airbugserver.GithubController')
//@Require('airbugserver.GithubService')
//@Require('airbugserver.HomePageController')
//@Require('airbugserver.MeldService')
//@Require('airbugserver.RequestContextBuilder')
//@Require('airbugserver.RoomController')
//@Require('airbugserver.RoomService')
//@Require('airbugserver.SessionController')
//@Require('airbugserver.SessionService')
//@Require('airbugserver.SessionServiceConfig')
//@Require('airbugserver.UserController')
//@Require('airbugserver.UserService')
//@Require('bugcall.BugCallRequestProcessor')
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
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('configbug.Configbug')
//@Require('cookies.CookieParser')
//@Require('cookies.CookieSigner')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('handshaker.Handshaker')
//@Require('loggerbug.Logger')
//@Require('mongo.MongoDataStore')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:server.SocketIoServer')
//@Require('socketio:server.SocketIoServerConfig')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var express                 = require('express');
var github                  = require('github');
var https                   = require('https');
var mongoose                = require('mongoose');
var mu2express              = require('mu2express');
var path                    = require('path');

//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var AirbugClientConfig      = bugpack.require('airbug.AirbugClientConfig');
var AirbugServerConfig      = bugpack.require('airbug.AirbugServerConfig');
var CallService             = bugpack.require('airbugserver.CallService');
var ChatMessageController   = bugpack.require('airbugserver.ChatMessageController');
var ChatMessageService      = bugpack.require('airbugserver.ChatMessageService');
var ConversationController  = bugpack.require('airbugserver.ConversationController');
var ConversationService     = bugpack.require('airbugserver.ConversationService');
var GithubApi               = bugpack.require('airbugserver.GithubApi');
var GithubController        = bugpack.require('airbugserver.GithubController');
var GithubService           = bugpack.require('airbugserver.GithubService');
var HomePageController      = bugpack.require('airbugserver.HomePageController');
var MeldService             = bugpack.require('airbugserver.MeldService');
var RequestContextBuilder   = bugpack.require('airbugserver.RequestContextBuilder');
var RoomController          = bugpack.require('airbugserver.RoomController');
var RoomService             = bugpack.require('airbugserver.RoomService');
var SessionController       = bugpack.require('airbugserver.SessionController');
var SessionService          = bugpack.require('airbugserver.SessionService');
var SessionServiceConfig    = bugpack.require('airbugserver.SessionServiceConfig');
var UserController          = bugpack.require('airbugserver.UserController');
var UserService             = bugpack.require('airbugserver.UserService');
var BugCallRequestProcessor = bugpack.require('bugcall.BugCallRequestProcessor');
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
var BugCallRouter           = bugpack.require('bugroute:bugcall.BugCallRouter');
var Configbug               = bugpack.require('configbug.Configbug');
var CookieParser            = bugpack.require('cookies.CookieParser');
var CookieSigner            = bugpack.require('cookies.CookieSigner');
var ExpressApp              = bugpack.require('express.ExpressApp');
var ExpressServer           = bugpack.require('express.ExpressServer');
var Handshaker              = bugpack.require('handshaker.Handshaker');
var Logger                  = bugpack.require('loggerbug.Logger');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');
var SocketIoServer          = bugpack.require('socketio:server.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('socketio:server.SocketIoServerConfig');


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
         * @type {AirbugClientConfig}
         */
        this._airbugClientConfig        = null;

        /**
         * @private
         * @type {AirbugServerConfig}
         */
        this._airbugServerConfig        = null;

        /**
         * @private
         * @type {BugCallRequestProcessor}
         */
        this._bugCallRequestProcessor   = null;

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
         * @type {ChatMessageService}
         */
        this._chatMessageService        = null;

        /**
         * @private
         * @type {Configbug}
         */
        this._configbug                 = null;

        /**
         * @private
         * @type {ConversationController}
         */
        this._conversationController    = null;

        /**
         * @private
         * @type {ConversationService}
         */
        this._conversationService       = null;

        /**
         * @private
         * @type {CookieParser}
         */
        this._cookieParser              = null;

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
         * @type {GithubController}
         */
        this._githubController          = null;

        /**
         * @private
         * @type {GithubService}
         */
        this._githubService             = null;

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
         * @type {RequestContextBuilder}
         */
        this._requestContextBuilder     = null;

        /**
         * @private
         * @type {RoomService}
         */
        this._roomService               = null;

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
         * @type {SessionServiceConfig}
         */
        this._sessionServiceConfig      = null;

        /**
         * @private
         * @type {SocketIoServerConfig}
         */
        this._socketIoServerConfig      = null;

        /**
         * @private
         * @type {UserController}
         */
        this._userController            = null;

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

        //TODO BRN: This configName should either be passed in via a parameter or set in some non code specific way
        /** @type {string} */
        var configName  = "dev";
        /** @type {Config} */
        var config      = undefined;

        $series([
            $task(function(flow) {
                _this.loadConfig(configName, function(throwable, loadedConfig) {
                    if (!throwable) {
                        config = loadedConfig;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.buildConfigs(config);

                var secret      = config.getProperty("cookieSecret");

                _this._cookieSigner.setSecret(secret);
                _this._mongoDataStore.connect('mongodb://' + config.getProperty("mongoDbIp") + '/airbug');


                _this._expressApp.configure(function() {
                    _this._expressApp.engine('mustache', mu2express.engine);
                    _this._expressApp.set('view engine', 'mustache');
                    _this._expressApp.set('views', path.resolve(__dirname, '../resources/views'));

                    _this._expressApp.set('port', config.getProperty("port"));

                    _this._expressApp.use(express.logger('dev'));
                    _this._expressApp.use(express.cookieParser(secret));

                    _this._expressApp.use(function(req, res, next) {
                        _this._sessionService.processExpressRequest(req, res, next);
                    });
                    _this._expressApp.use(function(req, res, next) {
                        _this._requestContextBuilder.buildRequestContextForExpress(req, res, next); //should this go first?
                    });

                    _this._expressApp.use(express.favicon(path.resolve(__dirname, '../static/img/airbug-icon.png')));
                    _this._expressApp.use(express.bodyParser());
                    _this._expressApp.use(express.methodOverride()); // put and delete support for html 4 and older
                    _this._expressApp.use(express.static(path.resolve(__dirname, '../static')));
                    _this._expressApp.use(_this._expressApp.getApp().router);
                });

                _this._expressApp.use(express.errorHandler());

                _this._bugCallServer.registerRequestPreProcessor(_this._requestContextBuilder);
                _this._bugCallServer.registerRequestProcessor(_this._bugCallRouter);

                _this._requestContextBuilder.registerRequestContextBuilder(_this._sessionService);
                _this._requestContextBuilder.registerRequestContextBuilder(_this._userService);
                _this._requestContextBuilder.registerRequestContextBuilder(_this._githubService);

                //TODO BRN: This setup should be replaced by an annotation
                _this._handshaker.addHands([
                    _this._sessionService
                ]);
                flow.complete();
            }),
            $task(function(flow) {
                console.log("Configuring socketIoServer");
                _this._socketIoServer.configure(function(error) {
                    if (!error) {
                        console.log("socketIoServer configured");
                    }
                    flow.complete(error);
                });
            }),

            //-------------------------------------------------------------------------------
            // Controllers
            //-------------------------------------------------------------------------------

            $task(function(flow) {
                _this._chatMessageController.configure();
                console.log("chatMessageController configured");
                _this._conversationController.configure();
                console.log("conversationController configured");
                _this._githubController.configure();
                console.log("githubController configured");
                _this._homePageController.configure();
                console.log("homePageController configured");
                _this._roomController.configure();
                console.log("roomController configured");
                _this._userController.configure();
                console.log("userController configured");
                flow.complete();
            }),

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
     * @return {AirbugClientConfig}
     */
    airbugClientConfig: function() {
        this._airbugClientConfig = new AirbugClientConfig();
        return this._airbugClientConfig;
    },

    /**
     * @return {AirbugServerConfig}
     */
    airbugServerConfig: function() {
        this._airbugServerConfig = new AirbugServerConfig();
        return this._airbugServerConfig;
    },

    /**
     * @param {SocketIoServer} socketIoServer
     * @return {SocketIoManager}
     */
    apiAirbugSocketIoManager: function(socketIoServer) {
        return new SocketIoManager(socketIoServer, '/api/airbug');
    },

    /**
     * @return {BugCallRequestProcessor}
     */
    bugCallRequestProcessor: function() {
        return new BugCallRequestProcessor();
    },

    /**
     * @return {BugCallRouter}
     */
    bugCallRouter: function() {
        this._bugCallRouter = new BugCallRouter();
        return this._bugCallRouter;
    },

    /**
     * @param {CallServer} callServer
     * @param {BugCallRequestProcessor} requestProcessor
     * @return {BugCallServer}
     */
    bugCallServer: function(callServer, requestProcessor) {
        this._bugCallServer = new BugCallServer(callServer, requestProcessor);
        return this._bugCallServer;
    },

    /**
     * @param {SocketIoManager} socketIoManager
     * @return {CallServer}
     */
    callServer: function(socketIoManager) {
        return new CallServer(socketIoManager);
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @return {CallService}
     */
    callService: function(bugCallServer) {
        this._callService = new CallService(bugCallServer);
        return this._callService;
    },

    /**
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {ChatMessageService} chatMessageService
     * @return {ChatMessageController}
     */
    chatMessageController: function(expressApp, bugCallRouter, chatMessageService) {
        this._chatMessageController = new ChatMessageController(expressApp, bugCallRouter, chatMessageService);
        return this._chatMessageController;
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
     * @return {Configbug}
     */
    configbug: function() {
        this._configbug = new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));
        return this._configbug;
    },

    /**
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {ConversationService} conversationService
     * @return {ConversationController}
     */
    conversationController: function(expressApp, bugCallRouter, conversationService) {
        this._conversationController = new ConversationController(expressApp, bugCallRouter, conversationService);
        return this._conversationController;
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
     * @return {CookieParser}
     */
    cookieParser: function() {
        return new CookieParser();
    },

    /**
     * @return {CookieSigner}
     */
    cookieSigner: function() {
        this._cookieSigner = new CookieSigner();
        return this._cookieSigner;
    },

    /**
     * @return {ExpressServer}
     */
    expressApp: function() {
        this._expressApp = new ExpressApp();
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
     * @return {*}
     */
    github: function() {
        return github;
    },

    /**
     * @param {https} https
     * @param {github} github
     * @param {AirbugServerConfig} airbugServerConfig
     * @return {GithubApi}
     */
    githubApi: function(https, github, airbugServerConfig) {
        return new GithubApi(https, github, airbugServerConfig);
    },

    /**
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {GithubService} githubService
     * @return {GithubController}
     */
    githubController: function(expressApp, bugCallRouter, githubService) {
        this._githubController = new GithubController(expressApp, bugCallRouter, githubService);
        return this._githubController;
    },

    /**
     * @param {SessionManager} sessionManager
     * @param {GithubManager} githubManager
     * @param {GithubApi} githubApi
     * @param {UserService} userService
     * @return {GithubService}
     */
    githubService: function(sessionManager, githubManager, githubApi, userService, userManager) {
        this._githubService = new GithubService(sessionManager, githubManager, githubApi, userService, userManager);
        return this._githubService;
    },

    /**
     * @return {Handshaker}
     */
    handshaker: function() {
        this._handshaker = new Handshaker([]);
        return this._handshaker;
    },

    /**
     * @param {AirbugClientConfig} airbugClientConfig
     * @param {ExpressApp} expressApp
     * @return {HomePageController}
     */
    homePageController: function(airbugClientConfig, expressApp) {
        this._homePageController = new HomePageController(airbugClientConfig, expressApp);
        return this._homePageController;
    },

    /**
     * @return {*}
     */
    https: function() {
        return https;
    },

    /**
     * @returns {Logger}
     */
    logger: function() {
        return new Logger();
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
     * @return {requestContextBuilder}
     */
    requestContextBuilder: function() {
        this._requestContextBuilder = new RequestContextBuilder();
        return this._requestContextBuilder;
    },

    /**
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {RoomService} roomService
     * @return {RoomController}
     */
    roomController: function(expressApp, bugCallRouter, roomService) {
        this._roomController = new RoomController(expressApp, bugCallRouter, roomService);
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
     * @return {UserController}
     */
    sessionController: function(expressApp, bugCallRouter, sessionService) {
        return new SessionController(expressApp, bugCallRouter, sessionService);
    },

    /**
     * @param {SessionServiceConfig} config
     * @param {CookieParser} cookieParser
     * @param {CookieSigner} cookieSigner
     * @param {SessionManager} sessionManager
     * @return {SessionService}
     */
    sessionService: function(config, cookieParser, cookieSigner, sessionManager) {
        this._sessionService = new SessionService(config, cookieParser, cookieSigner, sessionManager);
        return this._sessionService;
    },

    /**
     * @return {SessionServiceConfig}
     */
    sessionServiceConfig: function() {
        this._sessionServiceConfig = new SessionServiceConfig({});
        return this._sessionServiceConfig;
    },

    /**
     * @param {SocketIoServerConfig} config
     * @param {ExpressServer} expressServer
     * @param {Handshaker} handshaker
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
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {UserService} userService
     * @return {UserController}
     */
    userController: function(expressApp, bugCallRouter, userService) {
        this._userController = new UserController(expressApp, bugCallRouter, userService);
        return this._userController;
    },

    /**
     * @param {SessionManager} sessionManager
     * @param {UserManager} userManager
     * @param {MeldService} meldService
     * @param {SessionService} sessionService
     * @param {CallService} callService
     * @param {GithubManager} githubManager
     * @return {UserService}
     */
    userService: function(sessionManager, userManager, meldService, sessionService, callService, githubManager) {
        this._userService = new UserService(sessionManager, userManager, meldService, sessionService, callService, githubManager);
        return this._userService;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Config} config
     */
    buildConfigs: function(config) {
        this._airbugClientConfig.absorbConfig(config, [
            "github.clientId",
            "github.redirectUri",
            "github.scope"
        ]);

        this._airbugServerConfig.absorbConfig(config, [
            "github.clientId",
            "github.clientSecret"
        ]);

        this._sessionServiceConfig.absorbConfig(config, [
            "cookieMaxAge",
            "cookieSecret",
            "sessionKey"
        ]);
        this._socketIoServerConfig.setResource("/api/socket");
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        this._configbug.getConfig(configName, callback);
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

        module("https"),
        module("github"),
        module("mongoose"),
        module("mongoDataStore")
            .args([
                arg().ref("mongoose")
            ]),
        module("requestContextBuilder"),


        //-------------------------------------------------------------------------------
        // Config
        //-------------------------------------------------------------------------------

        module("configbug"),
        module("airbugClientConfig"),
        module("airbugServerConfig"),
        module("sessionServiceConfig"),


        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------

        module("expressApp"),
        module("expressServer")
            .args([
                arg().ref("expressApp")
            ]),


        //-------------------------------------------------------------------------------
        // Util
        //-------------------------------------------------------------------------------

        module("cookieParser"),
        module("cookieSigner"),
        module("handshaker"),
        module("logger"),


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

        module("bugCallRequestProcessor"),
        module("bugCallRouter"),
        module("bugCallServer")
            .args([
                arg().ref("callServer"),
                arg().ref("bugCallRequestProcessor")
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
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("chatMessageService")
            ]),
        module("conversationController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("conversationService")
            ]),
        module("githubController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("githubService")
            ]),
        module("homePageController")
            .args([
                arg().ref("airbugClientConfig"),
                arg().ref("expressApp")
            ]),
        module("roomController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("roomService")
            ]),
        module("sessionController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("sessionService")
            ]),
        module("userController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("userService")
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
        module("githubApi")
            .args([
                arg().ref("https"),
                arg().ref("github"),
                arg().ref("airbugServerConfig")
            ]),
        module("githubService")
            .args([
                arg().ref("sessionManager"),
                arg().ref("githubManager"),
                arg().ref("githubApi"),
                arg().ref("userService"),
                arg().ref("userManager")
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
            ])
            .properties([
                property("logger").ref("logger")
            ]),
        module("sessionService")
            .args([
                arg().ref("sessionServiceConfig"),
                arg().ref("cookieParser"),
                arg().ref("cookieSigner"),
                arg().ref("sessionManager")
            ]),
        module("userService")
            .args([
                arg().ref("sessionManager"),
                arg().ref("userManager"),
                arg().ref("meldService"),
                arg().ref("sessionService"),
                arg().ref("callService"),
                arg().ref("githubManager")
            ])
            .properties([
                property("logger").ref("logger")
            ])

        //-------------------------------------------------------------------------------
        // Managers (NOTE: EntityManagers are autoloaded)
        //-------------------------------------------------------------------------------
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugServerConfiguration", AirbugServerConfiguration);
