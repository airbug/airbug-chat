//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, roomService) {

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
         * @type {ExpressApp}
         */
        this.expressApp                 = expressApp;

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
        var _this           = this;
        var expressApp      = this.expressApp;
        var roomService     = this.roomService;

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/app/rooms/:id', function(request, response){
            var requestContext      = request.requestContext;
            var roomId              = request.params.id;
            roomService.retrieveRoom(requestContext, roomId, function(throwable, entity){
                var roomJson = null;
                if (entity) {
                    roomJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(roomJson);
                }
            });
        });

        expressApp.post('/app/rooms', function(request, response){
            var requestContext      = request.requestContext;
            var room                = request.body;
            roomService.createRoom(requestContext, room, function(throwable, entity){
                var roomJson = null;
                if (entity) {
                    roomJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(roomJson);
                }
            });
        });

        expressApp.put('/app/rooms/:id', function(request, response){
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            var updates         = request.body;
            roomService.updateRoom(requestContext, roomId, updates, function(throwable, entity){
                var roomJson = null;
                if (entity) {
                    roomJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(roomJson);
                }
            });
        });

        expressApp.delete('/app/rooms/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            roomService.deleteRoom(requestContext, roomId, function(throwable){
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

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

                roomService.addUserToRoom(requestContext, userId, roomId, function(throwable, user, room) {
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

                roomService.createRoom(requestContext, roomData, function(throwable, room) {
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

                roomService.joinRoom(requestContext, roomId, function(throwable, room) {
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

                roomService.leaveRoom(requestContext, roomId, function(throwable, room) {
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

                roomService.retrieveRoom(requestContext, roomId, function(throwable, room) {
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

                roomService.retrieveRooms(requestContext, roomIds, function(throwable, roomMap) {
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
