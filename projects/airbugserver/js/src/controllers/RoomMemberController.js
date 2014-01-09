//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberController')
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
var RoomMemberController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {RoomMemberService} roomMemberService
     */
    _constructor: function(controllerManager, expressApp, bugCallRouter, roomMemberService) {

        this._super(controllerManager, expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberService}
         */
        this.roomMemberService      = roomMemberService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {RoomMemberService}
     */
    getRoomMemberService: function() {
        return this.roomMemberService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this               = this;
        var expressApp          = this.getExpressApp();
        var roomMemberService   = this.getRoomMemberService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/api/v1/roommember/:id', function(request, response){
            var requestContext      = request.requestContext;
            var roomId              = request.params.id;
            roomMemberService.retrieveRoomMember(requestContext, roomId, function(throwable, entity){
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

        expressApp.post('/api/v1/roommember', function(request, response){
            var requestContext      = request.requestContext;
            var room                = request.body;
            roomMemberService.createRoomMember(requestContext, room, function(throwable, entity){
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

        expressApp.put('/api/v1/roommember/:id', function(request, response){
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            var updates         = request.body;
            roomMemberService.updateRoomMember(requestContext, roomId, updates, function(throwable, entity){
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

        expressApp.delete('/api/v1/roommember/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var roomId          = request.params.id;
            roomMemberService.deleteRoomMember(requestContext, roomId, function(throwable){
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
             * @param {function(Throwable=)} callback
             */
            createRoomMember:     function(request, responder, callback) {
                var data                = request.getData();
                var roomMemberData      = data.object;
                var requestContext      = request.requestContext;

                roomMemberService.createRoom(requestContext, roomData, function(throwable, room) {
                    _this.processCreateResponse(responder, throwable, room, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            deleteRoomMember: function(request, responder, callback) {
                var data                = request.getData();
                var roomMemberId        = data.objectId;
                var requestContext      = request.requestContext;

                roomMemberService.deleteRoomMember(requestContext, roomMemberId, function(throwable, roomMember) {
                    _this.processDeleteResponse(responder, throwable, roomMember, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveRoomMember:   function(request, responder, callback) {
                var data                = request.getData();
                var roomMemberId        = data.objectId;
                var requestContext      = request.requestContext;

                roomMemberService.retrieveRoomMember(requestContext, roomMemberId, function(throwable, roomMember) {
                    _this.processRetrieveResponse(responder, throwable, roomMember, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveRoomMembers: function(request, responder, callback) {
                var data                = request.getData();
                var roomMemberIds       = data.objectIds;
                var requestContext      = request.requestContext;

                roomMemberService.retrieveRooms(requestContext, roomMemberIds, function(throwable, roomMemberMap) {
                    _this.processRetrieveEachResponse(responder, throwable, roomMemberIds, roomMemberMap, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            updateRoomMember: function(request, responder, callback) {
                var data                = request.getData();
                var roomMemberId        = data.objectId;
                var roomMemberData      = data.object;
                var requestContext      = request.requestContext;

                roomMemberService.updateRoomMember(requestContext, roomMemberId, roomMemberData, function(throwable, room) {
                    _this.processUpdateResponse(responder, throwable, room, callback);
                });
            }
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberController).with(
    module("roomMemberController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("roomMemberService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberController', RoomMemberController);
