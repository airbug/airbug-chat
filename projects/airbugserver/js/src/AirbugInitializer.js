//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var express                         = require('express');
var mu2express                      = require('mu2express');
var path                            = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');
var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;
var $parallel                       = BugFlow.$parallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugInitializer = Class.extend(Obj, {

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
        this.airbugClientConfig                 = null;

        /**
         * @private
         * @type {AirbugServerConfig}
         */
        this.airbugServerConfig                 = null;

        /**
         * @private
         * @type {AwsUploader}
         */
        this.awsUploader                        = null;

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter                      = null;

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                      = null;

        /**
         * @private
         * @type {CallService}
         */
        this.callService                        = null;

        /**
         * @private
         * @type {Configbug}
         */
        this.configbug                          = null;

        /**
         * @private
         * @type {ControllerManager}
         */
        this.controllerManager                  = null;

        /**
         * @private
         * @type {CookieSigner}
         */
        this.cookieSigner                       = null;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp                         = null;

        /**
         * @private
         * @type {ExpressServer}
         */
        this.expressServer                      = null;

        /**
         * @private
         * @type {GithubService}
         */
        this.githubService                      = null;

        /**
         * @private
         * @type {Handshaker}
         */
        this.handshaker                         = null;

        /**
         * @private
         * @type {MongoDataStore}
         */
        this.mongoDataStore                     = null;

        /**
         * @private
         * @type {RedisConfig}
         */
        this.redisConfig                        = null;

        /**
         * @private
         * @type {RequestContextBuilder}
         */
        this.requestContextBuilder              = null;

        /**
         * @private
         * @type {SessionService}
         */
        this.sessionService                     = null;

        /**
         * @private
         * @type {SessionServiceConfig}
         */
        this.sessionServiceConfig               = null;

        /**
         * @private
         * @type {SocketIoServer}
         */
        this.socketIoServer                     = null;

        /**
         * @private
         * @type {SocketIoServerConfig}
         */
        this.socketIoServerConfig               = null;

        /**
         * @private
         * @type {UserService}
         */
        this.userService                        = null;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        var _this = this;
        console.log("Initializing AirbugConfiguration");

        /** @type {string} */
        var configName  = this.generateConfigName();
        /** @type {Config} */
        var config      = null;

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
                _this.sessionService.setConfig(_this.sessionServiceConfig);
                var secret      = config.getProperty("cookieSecret");

                _this.cookieSigner.setSecret(secret);
                _this.mongoDataStore.connect('mongodb://' + config.getProperty("mongoDbIp") + '/airbug');


                _this.expressApp.configure(function() {
                    console.log("Configuring express...");
                    _this.expressApp.engine('mustache', mu2express.engine);
                    _this.expressApp.set('view engine', 'mustache');
                    _this.expressApp.set('views', path.resolve(__dirname, '../resources/views'));

                    _this.expressApp.set('port', config.getProperty("port"));

                    _this.expressApp.use(express.logger('dev'));
                    _this.expressApp.use(express.cookieParser(secret));

                    _this.expressApp.use(function(req, res, next) {
                        _this.sessionService.processExpressRequest(req, res, next);
                    });
                    _this.expressApp.use(function(req, res, next) {
                        _this.requestContextBuilder.buildRequestContextForExpress(req, res, next); //should this go first?
                    });

                    _this.expressApp.use(express.favicon(path.resolve(__dirname, '../static/img/airbug-icon.png')));
                    _this.expressApp.use(express.bodyParser());
                    _this.expressApp.use(express.methodOverride()); // put and delete support for html 4 and older
                    _this.expressApp.use('/static', express.static(path.resolve(__dirname, '../static')));
                    _this.expressApp.use(_this.expressApp.getApp().router);
                });

                _this.expressApp.use(express.errorHandler());

                _this.bugCallServer.registerRequestPreProcessor(_this.requestContextBuilder);
                _this.bugCallServer.registerRequestProcessor(_this.bugCallRouter);

                _this.requestContextBuilder.registerRequestContextBuilder(_this.callService);
                _this.requestContextBuilder.registerRequestContextBuilder(_this.sessionService);
                _this.requestContextBuilder.registerRequestContextBuilder(_this.userService);
                _this.requestContextBuilder.registerRequestContextBuilder(_this.githubService);

                //TODO BRN: This setup should be replaced by an annotation
                _this.handshaker.addHands([
                    _this.sessionService
                ]);
                flow.complete();
            }),
            $task(function(flow) {
                console.log("Configuring socketIoServer");
                _this.socketIoServer.configure(function(error) {
                    if (!error) {
                        console.log("socketIoServer configured");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.awsUploader.initialize(function(error) {
                    if (!error) {
                        console.log("awsUploader initialized successfully");
                    } else {
                        console.log("awsUploader failed to initialize. error = ", error);
                    }
                    flow.complete(error);
                });
            }),


            //-------------------------------------------------------------------------------
            // Apps and Servers
            //-------------------------------------------------------------------------------

            $task(function(flow) {
                _this.controllerManager.initialize(function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                console.log("Initializing expressApp");

                _this.expressApp.initialize(function(error) {
                    if (!error) {
                        console.log("expressApp initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                console.log("starting expressServer");

                _this.expressServer.start(function(error) {
                    if (!error) {
                        console.log("expressServer started");
                    }
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Config} config
     */
    buildConfigs: function(config) {
        this.airbugClientConfig.absorbConfig(config, [
            "enableTracking",
            "github.clientId",
            "github.redirectUri",
            "github.scope",
            "staticUrl",
            "stickyStaticUrl"
        ]);

        this.airbugServerConfig.absorbConfig(config, [
            "github.clientId",
            "github.clientSecret",
            "staticUrl",
            "stickyStaticUrl"
        ]);

        this.sessionServiceConfig.absorbConfig(config, [
            "cookieMaxAge",
            "cookieSecret",
            "sessionKey"
        ]);
        this.socketIoServerConfig.setResource("/api/socket");
        this.redisConfig.setHost(config.getProperty("redis.host"));
        this.redisConfig.setPort(config.getProperty("redis.port"));
    },

    /**
     * @private
     * @return {string}
     */
    generateConfigName: function() {
        var configName = "dev";
        var index = process.argv.indexOf("--config");
        if (index > -1) {
            configName = process.argv[index + 1];
        } else if (process.env.CONFIGBUG) {
            configName = process.env.CONFIGBUG;
        }
        return configName;
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        this.configbug.getConfig(configName, callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AirbugInitializer, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugInitializer).with(
    module("airbugInitializer")
        .properties([
            property("airbugClientConfig").ref("airbugClientConfig"),
            property("airbugServerConfig").ref("airbugServerConfig"),
            property("awsUploader").ref("awsUploader"),
            property("bugCallRouter").ref("bugCallRouter"),
            property("bugCallServer").ref("bugCallServer"),
            property("callService").ref("callService"),
            property("configbug").ref("configbug"),
            property("controllerManager").ref("controllerManager"),
            property("cookieSigner").ref("cookieSigner"),
            property("expressApp").ref("expressApp"),
            property("expressServer").ref("expressServer"),
            property("githubService").ref("githubService"),
            property("handshaker").ref("handshaker"),
            property("mongoDataStore").ref("mongoDataStore"),
            property("redisConfig").ref("redisConfig"),
            property("requestContextBuilder").ref("requestContextBuilder"),
            property("sessionService").ref("sessionService"),
            property("sessionServiceConfig").ref("sessionServiceConfig"),
            property("socketIoServer").ref("socketIoServer"),
            property("socketIoServerConfig").ref("socketIoServerConfig"),
            property("userService").ref("userService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugInitializer", AirbugInitializer);
