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

        this.socketIoManager    = socketIoManager;

        this.userManager        = userManager;

    },

    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} data
     **/
    establishUser: function(data){
        var _this = this;
        this.userManager.findOrCreate(data, function(error, user){
            if(!error){
                currentUser = user;
                _this.socketIoManager.addEstablishedUserListeners(socket); //make sure this socket is the proper one
            } else {
                //_this.socketIoManager.emit('unableToEstablishUser')
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);

