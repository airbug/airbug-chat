//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ApplicationController')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.UsersApi')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var RoomsApi    = bugpack.require('airbugserver.RoomApi');
var UsersApi    = bugpack.require('airbugserver.UserApi');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationController = Class.extend(Obj, {

    _constructor: function(roomApi, userApi, socketIoManager, socketsMap){

        this._super();

        this.roomApi            = roomApi;

        this.socketIoManager    = socketIoManager;

        this.socketsMap         = socketsMap;

        this.userApi            = usersApi;

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ApplicationController', ApplicationController);

