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
//@Require('airbugserver.SocketIoManager')
//@Require('airbugserver.SocketRoutes')
//@Require('airbugserver.SocketsMap')

//@Require('airbugserver.AlphaPagesController')
//@Require('airbugserver.RoomsController')
//@Require('airbugserver.UsersController')

//@Require('airbugserver.RoomService')
//@Require('airbugserver.UserService')

//@Require('airbugserver.chatMessageManager')
//@Require('airbugserver.ConversationManager')
//@Require('airbugserver.RoomManager')
//@Require('airbugserver.RoomMemberManager')
//@Require('airbugserver.UserManager')

//@Require('airbugserver.ChatMessage')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.Dialogue')
//@Require('airbugserver.RoomMember')
//@Require('airbugserver.Room')
//@Require('airbugserver.User')

//@Require('airbugserver.ChatMessageSchema')
//@Require('airbugserver.ConversationSchema')
//@Require('airbugserver.DialogueSchema')
//@Require('airbugserver.RoomMemberSchema')
//@Require('airbugserver.RoomSchema')
//@Require('airbugserver.UserSchema')

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

var AirBugServer            = bugpack.require('airbugserver.AirBugServer');
var ExpressApp              = bugpack.require('airbugserver.ExpressApp');
var ExpressServer           = bugpack.require('airbugserver.ExpressServer');
var ExpressRoutes           = bugpack.require('airbugserver.ExpressRoutes');
var SocketIoManager         = bugpack.require('airbugserver.SocketIoManager');
var SocketIoServer          = bugpack.require('airbugserver.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('airbugserver.SocketIoServerConfig');
var SocketRoutes            = bugpack.require('airbugserver.SocketRoutes');
var SocketsMap              = bugpack.require('airbugserver.SocketsMap');

var AlphaPagesController    = bugpack.require('airbugserver.AlphaPagesController');
var RoomsController         = bugpack.require('airbugserver.RoomsController');
var UsersController         = bugpack.require('airbugserver.UsersController');

var RoomService             = bugpack.require('airbugserver.RoomService');
var UserService             = bugpack.require('airbugserver.UserService');

var ChatMessageManager      = bugpack.require('airbugserver.ChatMessageManager');
var ConversationManager     = bugpack.require('airbugserver.ConversationManager');
var RoomManager             = bugpack.require('airbugserver.RoomManager');
var RoomMemberManager       = bugpack.require('airbugserver.RoomMemberManager');
var UserManager             = bugpack.require('airbugserver.UserManager');

var ChatMessage             = bugpack.require('airbugserver.ChatMessage');
var Conversation            = bugpack.require('airbugserver.Conversation');
var Dialogue                = bugpack.require('airbugserver.Dialogue');
var Room                    = bugpack.require('airbugserver.Room');
var RoomMember              = bugpack.require('airbugserver.RoomMember');
var User                    = bugpack.require('airbugserver.User');

var ChatMessageSchema       = bugpack.require('airbugserver.ChatMessageSchema');
var ConversationSchema      = bugpack.require('airbugserver.ConversationSchema');
var DialogueSchema          = bugpack.require('airbugserver.DialogueSchema');
var RoomMemberSchema        = bugpack.require('airbugserver.RoomMemberSchema');
var RoomSchema              = bugpack.require('airbugserver.RoomSchema');
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
        this._airBugServer          = null;

        /**
         * @private
         * @type {SocketIoManager}
         */
        this._alphaSocketIoManager  = null;

        /**
         * @private
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         */
        this._config                = null;

        /**
         * @type {string}
         */
        this._configFilePath        = path.resolve(__dirname, '../config.json');

        /**
         * @type {ExpressApp}
         */
        this._expressApp            = null;

        /**
         * @type {ExpressServer}
         */
        this._expressServer         = null;

        /**
         * @type {RoomsController}
         */
        this._roomsController       = null;

        /**
         * @type {SocketIoManager}
         */
        this._socketIoManager       = null;

        /**
         * @type {UsersController}
         */
        this._usersController       = null;

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
            //-------------------------------------------------------------------------------
            // Model Managers
            //-------------------------------------------------------------------------------
            $parallel([
                $task(function(flow){
                    _this._chatMessageManager.configure(function(error){
                        if(!error) console.log("chatMessageManager configured");
                        flow.complete(error);
                    });
                }),
                $task(function(error){
                    _this._conversationManager.configure(function(error){
                        if(!error) console.log("conversationManager configured")
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this._roomManager.configure(function(error){
                        if(!error) console.log("roomManager configured");
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this._roomMemberManager.configure(function(error){
                        if(!error) console.log("roomMemberManager configured");
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this._userManager.configure(function(error){
                        if(!error) console.log("userManager configured");
                        flow.complete(error);
                    });
                })
            ]),
            //-------------------------------------------------------------------------------
            // Services
            //-------------------------------------------------------------------------------

            //-------------------------------------------------------------------------------
            // Controllers
            //-------------------------------------------------------------------------------
            $parallel([
                $task(function(flow){
                    _this._roomsController.configure(function(error){
                        if(!error){
                            console.log("roomsController configured");
                        }
                        flow.complete(error);
                    })
                }),
                $task(function(flow){
                    _this._usersController.configure(function(error){
                        if(!error){
                            console.log("usersController configured");
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
            })
        ]).execute(function(error){
            if(!error){
                console.log("AirBugConfiguration successfully initialized.")
            } else {
                console.log(error);
            }
        });
    },

    /**
     * @param {RoutesManager} expressRoutesManager
     * @return {AlphaPagesController}
     */
    alphaPagesController: function(expressRoutesManager){
        return new AlphaPagesController(expressRoutesManager);
    },

    /**
     * @return {}
     */
    alphaSocket: function(){
        return this._alphaSocketIoManager.getIoManager();
    },

    /**
     * @param {}
     * @param {}
     * @return {SocketIoManager}
     */
    alphaSocketIoManager: function(socketIoServer, socketsMap){
        this._alphaSocketIoManager = new SocketIoManager(socketIoServer, '/alpha', socketsMap);
        return this._alphaSocketIoManager;
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
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {ChatMessageManager}
     */
    chatMessageManager: function(model, schema){
        this._chatMessageManager = new ChatMessageManager(model, schema);
        return this._chatMessageManager;
    },

    /**
     * @return {ChatMessageSchema}
     */
    chatMessageSchema: function(){
        return ChatMessageSchema;
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
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {ConversationManager}
     */
    conversationManager: function(model, schema){
        this._conversationManager = new ConversationManager(model, schema);
        return this._conversationManager;
    },

    /**
     * @return {ConversationSchema}
     */
    conversationSchema: function(){
        return ConversationSchema;
    },

    /**
     * @return {Dialogue}
     */
    dialogue: function(){
        return Dialogue;
    },

    /**
     * @return {DialogueSchema}
     */
    dialogueSchema: function(){
        return DialogueSchema;
    },

    /**
     * @param {}
     * @return {ExpressServer}
     */
    expressApp: function(config) {
        this._expressApp = new ExpressApp(config);
        return this._expressApp;
    },

    /**
     * @param {}
     * @param {}
     * @return {RoutesManager}
     */
    expressRoutesManager: function(app, routes){
        return new RoutesManager(app, routes);
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
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {RoomManager}
     */
    roomManager: function(model, schema){
        this._roomManager = new RoomManager(model, schema);
        return this._roomManager;
    },

    /**
     * @return {RoomMember}
     */
    roomMember: function(){
        return RoomMember;
    },

    /**
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {RoomMemberManager}
     */
    roomMemberManager: function(model, schema){
        this._roomMemberManager = new RoomMemberManager(model, schema);
        return this._roomMemberManager;
    },

    /**
     * @return {RoomMemberSchema}
     */
    roomMemberSchema: function(){
        return RoomMemberSchema;
    },

    /**
     * @param {}
     * @param {}
     * @return {RoomsController}
     */
    roomsController: function(socketIoManager, roomService){
        this._roomsController = new RoomsController(socketIoManager, roomService);
        return this._roomsController;
    },

    /**
     * @return {RoomSchema}
     */
    roomSchema: function(){
        return RoomSchema;
    },

    /**
     * @return {MemoryStore}
     */
    sessionStore: function(){
        return new connect.middleware.session.MemoryStore();
    },

    /**
     * @param {}
     * @param {}
     * @return {SocketIoServer}
     */
    socketIoServer: function(config, expressServer){
        this._socketIoServer = new SocketIoServer(config, expressServer);
        return this._socketIoServer;
    },

    /**
     * @return {SocketIoServerConfig}
     */
    socketIoServerConfig: function(){
        return new SocketIoServerConfig({});
    },

    /**
     * @return {SocketIoManager}
     */
    socketIoManager: function() {
        return new SocketIoManager();
    },

    /**
     * @return {SocketsMap}
     */
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
     * @param {mongoose.Model} model
     * @param {mongoose.Schema} schema
     * @return {UserManager}
     */
    userManager: function(model, schema){
        this._userManager = new UserManager(model, schema);
        return this._userManager;
    },

    /**
     * @param {}
     * @param {}
     * @return {UsersController}
     */
    usersController: function(socketIoManager, userService){
        this._usersController = new UsersController(socketIoManager, userService);
        return this._usersController;
    },

    /**
     * @return {UserSchema}
     */
    userSchema: function(){
        return UserSchema;
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
                property("sessionStore").ref("sessionStore")
            ]),
        module("expressRoutesManager")
            .args([
                arg("app").ref("expressApp"),
            ])
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
        module("socketIoManager"),
        module("alphaSocketIoManager")
            .args([
                arg("socketIoServer").ref("socketIoServer"),
                arg("socketsMap").ref("socketsMap")
            ]),
        module("socketsMap"),
        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------
        module("alphaPagesController")
            .args([
                arg("expressRoutesManager").ref("expressRoutesManager"),
            ]),
        module("RoomsController")
            .args([
                arg("socketIoManager").ref("alphaSocketIoManager"),
                arg("roomService").ref("roomService")
            ]),
        module("UsersController")
            .args([
                arg("socketIoManager").ref("alphaSocketIoManager"),
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
        module("userManager")
            .args([
                arg("model").ref("user"),
                arg("schema").ref("userSchema")
            ]),
        //-------------------------------------------------------------------------------
        // Models
        //-------------------------------------------------------------------------------
        module("chatMessage"),
        module("conversation"),
        module("dialogue"),
        module("room"),
        module("roomMember"),
        module("user"),
        //-------------------------------------------------------------------------------
        // Schemas
        //-------------------------------------------------------------------------------
        module("chatMessageSchema"),
        module("conversationSchema"),
        module("dialogueSchema"),
        module("roomMemberSchema"),
        module("roomSchema"),
        module("userSchema")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirBugConfiguration", AirBugConfiguration);
