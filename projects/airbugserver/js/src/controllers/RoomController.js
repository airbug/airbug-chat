//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')

//@Require('Class')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbugserver.EntityController')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var TypeUtil            = bugpack.require('TypeUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, roomService, requestContextFactory) {

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

        /**
         * @private
         * @type {RequestContextFactory}
         */
        this.requestContextFactory      = requestContextFactory;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable)} callback
     */
    configure: function(callback) {
        if (!callback || typeof callback !== 'function') {
            callback = function(){};
        }

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
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {
                            objectId: room.getId()
                        });
                    } else {
                        _this.processThrowable(responder, throwable);
                    }
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
            retrieveRooms: function(request, responder) {
                var data                = request.getData();
                var roomIds             = data.objectIds;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
                var dataMap             = new Map();

                _this.roomService.retrieveRooms(requestContext, roomIds, function(throwable, roomMap) {
                    roomIds.forEach(function(roomId) {
                        var room = roomMap.get(roomId);
                        if (!TypeUtil.isNull(room) && !TypeUtil.isUndefined(room)) {
                            dataMap.put(roomId, true);
                        } else {
                            dataMap.put(roomId, false);
                        }
                    });
                    _this.processMappedResponse(responder, throwable, dataMap);
                });
            }
        });

        callback();

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
