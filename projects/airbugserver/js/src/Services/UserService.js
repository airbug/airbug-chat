//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserService = Class.extend(Obj, {

    _constructor: function(socketIoManager, userManager){

        this._super();

        this.socketIoManager    = socketIoManager.getIoManager();

        this.userManager        = userManager;

    },

    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} user
     * @param {SocketIoConnection} socket
     **/
    establishUser: function(user, socket){
        var _this = this;
        this.userManager.findOrCreate(user, function(error, user){
            if(!error){
                currentUser = user;
                _this.socketsMap.associateUserWithSocket({user: user, socket: socket});
            } else {
                //_this.socketIoManager.emit('unableToEstablishUser')
            }
        });
    },

    /**
     * @param {} 
     */
    getCurrentUser: function(callback){
        
    },

    /**
     * @param {} 
     */
    logoutCurrentUser: function(callback){
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);

