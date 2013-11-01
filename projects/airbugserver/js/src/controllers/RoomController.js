//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')

//@Require('Class')
//@Require('airbugserver.EntityController')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EntityController    = bugpack.require('airbugserver.EntityController');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, roomService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter              = bugCallRouter;

        /**
         * @private
         * @type {RoomService}
         */
        this.roomService                = roomService;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this               = this;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            addUserToRoom:  function(request, responder, callback) {
                var data                = request.getData();
                var userId              = data.userId;
                var roomId              = data.roomId;
                var requestContext      = request.requestContext;

                _this.roomService.addUserToRoom(requestContext, userId, roomId, function(throwable, user, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {}, callback);
                    } else {
                        _this.processThrowable(responder, throwable, callback);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            createRoom:     function(request, responder, callback) {
                var data                = request.getData();
                var roomData            = data.object;
                var requestContext      = request.requestContext;

                _this.roomService.createRoom(requestContext, roomData, function(throwable, room) {
                    _this.processCreateResponse(responder, throwable, room, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            joinRoom:       function(request, responder, callback) {
                var data                = request.getData();
                var roomId              = data.roomId;
                var requestContext      = request.requestContext;

                _this.roomService.joinRoom(requestContext, roomId, function(throwable, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {}, callback);
                    } else {
                        _this.processThrowable(responder, throwable, callback);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            leaveRoom:      function(request, responder, callback) {
                var data                = request.getData();
                var roomId              = data.roomId;
                var requestContext      = request.requestContext;

                _this.roomService.leaveRoom(requestContext, roomId, function(throwable, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {}, callback);
                    } else {
                        _this.processThrowable(responder, throwable, callback);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveRoom:   function(request, responder, callback) {
                var data                = request.getData();
                var roomId              = data.objectId;
                var requestContext      = request.requestContext;

                _this.roomService.retrieveRoom(requestContext, roomId, function(throwable, room) {
                    _this.processRetrieveResponse(responder, throwable, room, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveRooms: function(request, responder, callback) {
                var data                = request.getData();
                var roomIds             = data.objectIds;
                var requestContext      = request.requestContext;

                _this.roomService.retrieveRooms(requestContext, roomIds, function(throwable, roomMap) {
                    _this.processRetrieveEachResponse(responder, throwable, roomIds, roomMap, callback);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
