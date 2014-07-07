/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AirbugCallController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var LiteralUtil             = bugpack.require('LiteralUtil');
    var EntityController        = bugpack.require('airbugserver.EntityController');
    var ControllerTag    = bugpack.require('bugcontroller.ControllerTag');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var controller              = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var AirbugCallController = Class.extend(EntityController, {

        _name: "airbugserver.AirbugCallController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {RoomService} roomService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, roomService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
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
                    _this.processAjaxUpdateResponse(response, throwable, entity);
                });
            });

            expressApp.delete('/api/v1/room/:id', function(request, response){
                var _this = this;
                var requestContext  = request.requestContext;
                var roomId          = request.params.id;
                roomService.deleteRoom(requestContext, roomId, function(throwable, entity){
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
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                startRoom:     function(request, responder, callback) {
                    var data                = request.getData();
                    var startRoomObject     = data.startRoomObject;
                    var requestContext      = request.requestContext;

                    roomService.startRoom(requestContext, startRoomObject, function(throwable, room) {
                        _this.processCreateResponse(responder, throwable, room, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugCallController).with(
        controller("airbugCallController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("roomService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugCallController', AirbugCallController);
});
