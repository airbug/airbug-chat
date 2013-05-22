//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomApi')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomInterface = {
    
};

// Implementation of Room interface for mongoose Model
var RoomApi = Class.extend(Obj, {

    _constructor: function(model){

        this._super();


        //-------------------------------------------------------------------------------
        // Dependencies
        //-------------------------------------------------------------------------------

        /**
         * @type {mongoose.Model.Room}
         */
        this.model = model;

    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    getModel: function(){
        return this.model;
    },

    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    getMembersList: function(roomId){
        this.model.findById(roomId, function(error, room){
            return room.memberslist;
        });
    },

    create: function(room, callback){
        this.model.create(room, callback);
    },

    findById: function(id, callback){
        this.model.findById(id, function(error, room){
            callback(error, room);
        });
    },

    addUser: function(roomId, user, callback){
        this.model.findById(roomId, function(error, room){
            if(!error){
                var roomMemeber = new RoomMember();
                room.membersList.push(roomMember);
                room.save(callback);
            } else {
                callback(error);
            }
        })
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomApi', RoomApi);
