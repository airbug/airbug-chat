//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')

//@Require('Class')
//@Require('Obj')


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

var RoomController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, roomService, connectionService){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter      = bugCallRouter;

        /**
         * @private
         * @type {ConnectionService}
         */
        this.connectionService  = connectionService;

        /**
         * @private
         * @type {RoomService}
         */
        this.roomService        = roomService;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback) {
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            addUserToRoom:  function(request, responder){
                var currentUser = request.getHandshake().user;
                var data        = request.getData();
                var userId      = data.userId;
                var roomId      = data.roomId;
                if(currentUser.isNotAnonymous()){
                    _this.roomService.addUserToRoom(userId, roomId, function(error, room){
                        console.log("************************************************************");
                        console.log("Inside callback for roomService#addUserToRoom");
                        console.log("Error:", error);
                        console.log("Room:", room);
                        if(!error && room){
                            var data        = {room: room};
                            var response    = responder.response("addedUserToRoom", data);
                        } else if(error){
                            console.log(error);
                        } else {
                            var data        = {error: error};
                            var response    = responder.response("addUserToRoomError", data);
                        }
                        responder.sendResponse(response);
                    })
                } else {
                    var data        = {error: new Error("Unauthorized Access")};
                    var response    = responder.response("addUserToRoomError", data);
                    responder.sendResponse(response);
                }
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            createRoom:     function(request, responder){
                var currentUser = request.getHandshake().user;
                var data        = request.getData();
                var room        = data.room;
                if(currentUser.isNotAnonymous()){
                    _this.roomService.createRoom(currentUser, room, function(error, user, room){
                        if(!error && room){
                            var data        = {
                                room: room,
                                user: user
                            };
                            var response    = responder.response("createdRoom", data);
                        } else {
                            var data        = {
                                error: error,
                                roomId: room.id
                            };
                            var response    = responder.response("createRoomError", data);
                        }
                        responder.sendResponse(response); 
                    }) 
                } else {
                    var data        = {error: new Error("Unauthorized Access")}
                    var response    = responder.response("createRoomError", data);
                    responder.sendResponse(response);
                }
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            joinRoom:       function(request, responder){
                var currentUser = request.getHandshake().user;
                var data        = request.getData();
                var userId      = currentUser.id;
                var roomId      = data.roomId;
                if(currentUser.isNotAnonymous()){
                    _this.roomService.addUserToRoom(userId, roomId, function(error, user, room){
                        if(!error && room){
                            var data        = {room: room};
                            var response    = responder.response("joinedRoom", data);
                            responder.sendResponse(response);
                        } else {
                            var data        = {
                                error: error,
                                roomId: roomId
                            };
                            var response    = responder.response("joinRoomError", data);
                            responder.sendResponse(response);
                        }
                    });
                } else {
                    var data        = {error: new Error("Unauthorized Access")};
                    var response    = responder.response("joinRoomError", data);
                    responder.sendResponse(response);
                }
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            leaveRoom:      function(request, responder){
                var currentUser = request.getHandshake().user;
                if(currentUser.isNotAnonymous()){
                    var data        = request.getData();
                    var userId      = currentUser.id;
                    var roomId      = data.roomId;
                    _this.roomService.removeUserFromRoom(userId, roomId, function(error, user, room){
                        if(!error && room){
                            var data        = {room: room};
                            var response    = responder.response("leftRoom", data);
                            responder.sendResponse(response);
                        } else {
                            var data        = {
                                error: error,
                                roomId: roomId
                            };
                            var response    = responder.response("leaveRoomError", data);
                            responder.sendResponse(response);
                        }
                    });
                } else {
                    var data        = {error: new Error("Unauthorized Access")};
                    var response    = responder.response("leaveRoomError", data);
                    responder.sendResponse(response);
                }
            }
        });

        callback();

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
