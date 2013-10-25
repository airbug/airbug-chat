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
             */
            addUserToRoom:  function(request, responder) {
                var data                = request.getData();
                var userId              = data.userId;
                var roomId              = data.roomId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.addUserToRoom(requestContext, userId, roomId, function(throwable, user, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {});
                    } else {
                        _this.processThrowable(responder, throwable);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            createRoom:     function(request, responder) {
                var data                = request.getData();
                var roomData            = data.object;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.createRoom(requestContext, roomData, function(throwable, room) {
                    _this.processCreateResponse(responder, throwable, room);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            joinRoom:       function(request, responder) {
                var data                = request.getData();
                var roomId              = data.roomId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.joinRoom(requestContext, roomId, function(throwable, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {});
                    } else {
                        _this.processThrowable(responder, throwable);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            leaveRoom:      function(request, responder) {
                var data                = request.getData();
                var roomId              = data.roomId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.leaveRoom(requestContext, roomId, function(throwable, room) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {});
                    } else {
                        _this.processThrowable(responder, throwable);
                    }
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveRoom:   function(request, responder) {
                var data                = request.getData();
                var roomId              = data.objectId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.retrieveRoom(requestContext, roomId, function(throwable, room) {
                    _this.processRetrieveResponse(responder, throwable);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveRooms: function(request, responder) {
                var data                = request.getData();
                var roomIds             = data.objectIds;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.roomService.retrieveRooms(requestContext, roomIds, function(throwable, roomMap) {
                    _this.processRetrieveEachResponse(responder, throwable, roomIds, roomMap);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
