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

    _constructor: function(socketIoManager, userService){

        this._super();

        this.socketIoManager        = socketIoManager;

        this.socketRoutesManager    = null;

        this.userService            = userService;

    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        var _this       = this;
        var callback    = callback || function(){};
        var ioManager   = this.socketIoManager.getIoManager();
        this.socketRoutesManager = new RoutesManager(ioManager);
        this.socketRoutesManager.addAll([
            new SocketRoute("establishUser", function(params){
                var user = {
                    email: params.user.email,
                    name: params.user.name
                };
                _this.userService.establishUser(user);
            }),
            new SocketRoute("getCurrentUser", function(params){

            }),
            new SocketRoute("logoutCurrentUser", function(params){

            })
        ]);

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UsersController', UsersController);
