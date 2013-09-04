//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomService')

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

var Class       = bugpack.require('Class');
var BugFlow     = bugpack.require('bugflow.BugFlow');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel   = BugFlow.$parallel;
var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomManager, userManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomManager}
         */
        this.roomManager            = roomManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager            = userManager;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} currentUser
     * @param {Room} room
     * @param {function(Error, User, Room)} callback
     */
    createRoom: function(currentUser, room, callback) {
        //TODO: SUNG clean this up
        var _this = this;
        this.roomManager.createRoom(room, function(error, room) {
            if (!error && room) {
                _this.addUserToRoom(currentUser.id, room.id, function(error, room, user) {
                    if(!error && user && room){
                        callback(error, room, user);
                    } else {
                        callback(error, room, user);
                    }
                });
            } else {
                callback(error, room, currentUser);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, user, room)} callback
     */
    addUserToRoom: function(userId, roomId, callback) {
        //TODO: change this into a "transaction"
        var _this = this;
        var room;
        var user;
        $series([
            $parallel([
                $task(function(flow){
                    _this.roomManager.addUserToRoom(userId, roomId, function(error, returnedRoom){
                        if(!error && returnedRoom){
                            _this.roomManager.populate(returnedRoom, {path: "membersList"}, function(error, returnedRoom){
                                room = returnedRoom;
                                flow.complete(error);
                            });
                        } else {
                            flow.complete(error);
                        }
                    });
                }),
                $task(function(flow){
                    _this.userManager.addRoomToUser(roomId, userId, function(error, returnedUser){
                        user = returnedUser;
                        flow.complete(error);
                    });
                })
            ]),
            $task(function(flow){
                //notify roomMembers of change
                flow.complete();
            })
        ]).execute(function(error){
            console.log("RoomService#addUserToRoom results: Error:", error, "user:", user, "room:", room);
            callback(error, room, user);
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, room)} callback
     */
    removeUserFromRoom: function(userId, roomId, callback){
        var _this = this;
        var room;
        var user;
        $series([
            $parallel([
                $task(function(flow){
                    _this.roomManager.removeUserFromRoom(userId, roomId, function(error, returnedRoom){
                        room = returnedRoom;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this.userManager.removeRoomFromUser(roomId, userId, function(error, returnedUser){
                        user = returnedUser;
                        flow.complete(error);
                    });
                })
            ]),
            $task(function(flow){
                //notify roomMembers of change
                flow.complete();
            })
        ]).execute(function(error){
            console.log("RoomService#removeUserFromRoom results: Error:", error, "user:", user, "room:", room);
            callback(error, room, user);
        });
    },

    /**
     * @param {string} roomId
     * @param {function(Error, room)} callback
     */
    retrieveRoom: function(roomId, callback){
        this.roomManager.findById(roomId).populate("membersList").exec(callback);
    },

    /**
     * @param {Array.<string>} roomIds
     * @param {function(Error, room)} callback
     */
    retrieveRooms: function(roomIds, callback){
        var query = this.roomManager.where("_id").in(roomIds).populate("membersList").exec(callback);
    }


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
