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

var Class   = bugpack.require('Class');
var BugFlow = bugpack.require('bugflow.BugFlow');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel   = BugFlow.$parallel;
var $task       = BugFlow.$parallel;


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
     * @param {function(Error, Room)} callback
     */
    createRoom: function(currentUser, room, callback) {
        var _this = this;
        var room = this.roomManager.create(room, function(error, room){
            if(!error && room){
                _this.addUserToRoom(currentUser.id, room.id, callback);
            } else {
                callback(error, room);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error)} callback
     */
    addUserToRoom: function(userId, roomId, callback){
        //TODO: change into a "transaction"
        var _this = this;
        var room;
        $parallel([
            $task(function(flow){
                _this.roomManager.addUserToRoom(roomId, userId, function(error, returnedRoom){
                    room = returnedRoom;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                _this.userManager.addRoomToUser(userId, roomId, function(error, user){
                    flow.complete(error);
                });
            })
        ]).execute(function(error){
            if(error){
                //TODO
            }
            callback(error, room);
        })
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(Error)} callback
     */
    removeUserFromRoom: function(userId, roomId, callback){
        this.roomManager.removeUser(roomId, userId, callback);
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
