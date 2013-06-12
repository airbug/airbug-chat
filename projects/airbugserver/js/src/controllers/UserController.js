//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

//@Require('Class')
//@Require('Obj')
//@Require('bugroutes.SocketRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var SocketRoute = bugpack.require('bugroutes.SocketRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketRouter, userService){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SocketRouter}
         */
        this.socketRouter   = socketRouter;

        /**
         * @private
         * @type {UserService}
         */
        this.userService    = userService;

    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        this.socketRouter.addAll([

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

bugpack.export('airbugserver.UserController', UserController);
