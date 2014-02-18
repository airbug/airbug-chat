//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


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
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EntityController}
 */
var RoomController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ControllerManager} controllerManager
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {RoomService} roomService
     */
    _constructor: function(controllerManager, expressApp, bugCallRouter, roomService) {

        this._super(controllerManager, expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomService}
         */
        this.roomService                = roomService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {RoomService}
     */
    getRoomService: function() {
        return this.roomService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this           = this;
        var expressApp      = this.getExpressApp();
        var roomService     = this.getRoomService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/api/v1/room/:id', function(request, response){
            var requestContext      = request.requestContext;
            var roomId              = request.params.id;
            roomService.retrieveRoom(requestContext, roomId, function(throwable, entity){
                _this.processAjaxRetrieveResponse(response, throwable, entity);
            });
        });

        expressApp.post('/api/v1/room', function(request, response){
            var requestContext      = request.requestContext;
            var room                = request.body;
            roomService.createRoom(requestContext, room, function(throwable, entity){
                _this.processAjaxCreateResponse(response, throwable, entity);
            });
        });

        expressApp.put('/api/v1/room/:id', function(request, response){
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            var updates         = request.body;
            roomService.updateRoom(requestContext, roomId, updates, function(throwable, entity){
                _this.processAjaxUpdateResponse(response, throwable, entity);sponse.json(roomJson);
            });
        });

        expressApp.delete('/api/v1/room/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            roomService.deleteRoom(requestContext, roomId, function(throwable){
                _this.processAjaxDeleteResponse(response, throwable, entity);
            });
        });

        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
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
             * @param {function(Throwable=)} callback
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
             * @param {function(Throwable=)} callback
             */
            joinRoom:       function(request, responder, callback) {
                var data                = request.getData();
                var roomId              = data.roomId;
                var requestContext      = request.requestContext;

                roomService.joinRoom(requestContext, roomId, function(throwable, user, room) {
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
             * @param {function(Throwable=)} callback
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
             * @param {function(Throwable=)} callback
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
             * @param {function(Throwable=)} callback
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
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomController).with(
    module("roomController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("roomService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomController', RoomController);
