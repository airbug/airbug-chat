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
        console.log("Hello from inside RoomService#createRoom");
        var _this = this;
        var room = this.roomManager.create(room, function(error, room){
            console.log("Results of roomManager#create: error:", error, "room:", room);
            if(!error && room){
                _this.addUserToRoom(currentUser.id, room.id, function(error, user, room){
                    if(!error && user && room){
                        callback(error, user, room);
                    } else {
                        callback(error, user, room);
                    }
                });
            } else {
                callback(error, currentUser, room);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, user, room)} callback
     */
    addUserToRoom: function(userId, roomId, callback){
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
                                room = returnedRoom
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
            callback(error, user, room);
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error, room)} callback
     */
    removeUserFromRoom: function(userId, roomId, callback){
        this.roomManager.removeUserFromRoom(userId, roomId, callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {ObjectId} roomId
     * @param {string} requestType
     * @param {{*}} requestData
     * @param {function(error)} callback
     **/
    notifyRoomMembers: function(roomId, requestType, requestData, callback){
        //TODO
        var _this               = this;
        var connectionService   = this.connectionService;
        this.roomManager.findById(roomId).populate("membersList.userId").exec(function(error, room){
            if(!error && room){
                var roomMembers = room.membersList;
                //TODO: Create notification tasks and put them into the queue
                //TODO: Keep track of responses. handle responses that are missing or erroring
                var roomMemberConnections = [];
                roomMembers.forEach(function(roomMember){
                    var userId          = roomMember.userId;
                    var callConnections = connectionService.findConnectionsByUserId(userId);

                    roomMemberConnections.concat(callConnections);
                    var bugCallServer   = _this.bugCallServer;
                    callConnections.forEach(function(callConnection){
                        bugCallServer.request(callConnection, requestType, requestData, function(exception, callResponse){
                            var responseType = callResponse.getType();
                            var responseData = callResponse.getData();
                            //TODO
                        });
                    });
                });
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomService', RoomService);
