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

//@Export('airbug.RoomPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.RoomPageContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerTag')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
    var RoomPageContainer       = bugpack.require('airbug.RoomPageContainer');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerTag           = bugpack.require('carapace.ControllerTag');
    var RoutingRequest          = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredTag.autowired;
    var controller              = ControllerTag.controller;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var RoomPageController = Class.extend(ApplicationController, {

        _name: "airbug.RoomPageController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomPageContainer}
             */
            this.roomPageContainer = null;

            /**
             * @private
             * @type {RoomManagerModule}
             */
            this.roomManagerModule = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.roomPageContainer = new RoomPageContainer();
            this.setContainerTop(this.roomPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.roomPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            var _this = this;
            this.requireLogin(routingRequest, function(throwable, currentUser) {
                if (!throwable) {
                    var roomId      = routingRequest.getArgs()[0];
                    _this.roomManagerModule.retrieveRoom(roomId, function(throwable, room) {
                        if (!throwable) {
                            if (currentUser.getRoomIdSet().contains(roomId)) {
                                routingRequest.accept();
                            } else {
                                _this.roomManagerModule.joinRoom(roomId, function(throwable) {
                                    if (!throwable) {
                                        routingRequest.accept();
                                    } else {
                                        routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                                    }
                                });
                            }
                        } else {
                            if (throwable.getType() === "NotFound") {
                                routingRequest.reject(RoutingRequest.RejectReason.NOT_FOUND);
                            } else {
                                routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                            }
                        }
                    });
                } else {
                    routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomPageController).with(
        controller().route("conversation/:id"),
        autowired().properties([
            property("roomManagerModule").ref("roomManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomPageController", RoomPageController);
});
