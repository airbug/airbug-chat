//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UsersController')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var BugFlow                 = bugpack.require('bugflow.BugFlow');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UsersController = Class.extend(Obj, {

    _constructor: function(socketRoutesManager, socketIoManager, userService){

        this._super();

        /**
         * @type {SocketRoutesManager}
         */
        this.socketRoutesManager    = socketRoutesManager;

        /**
         * @type {SocketIoManager}
         */
        this.socketIoManager        = socketIoManager; //Necessary??

        /**
         * @type {UserService}
         */
        this.userService            = userService;

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        var ioManager           = this.socketIoManager.getIoManager();
        var socketRoutesManager = this.socketRoutesManager;
        this.socketRoutesManager.addAll([

            new SocketRoute("establishUser", function(socket, data){
                var user = {
                    email: data.user.email,
                    name: data.user.name
                };
                _this.userService.establishUser(user, socket);
            }),
            new SocketRoute("getCurrentUser", function(socket, data){

            }),
            new SocketRoute("logoutCurrentUser", function(socket, data){

            })
        ]);

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UsersController', UsersController);
