//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UsersController')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.ApplicationController')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ApplicationController   = bugpack.require('airbugserver.ApplicationController');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UsersController = Class.extend(ApplicationController, {

    _constructor: function(){

        this._super();

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
        this.userApi.establishUser(data, function(error, user){
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

bugpack.export('airbugserver.UsersController', UsersController);

