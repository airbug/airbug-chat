//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.RoomPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ApplicationController   = bugpack.require('airbug.ApplicationController');
var RoomPageContainer       = bugpack.require('airbug.RoomPageContainer');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta     = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var controller  = ControllerAnnotation.controller;
var property    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
    // CarapaceController Extensions
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

                    //TEST
                    console.log("RoomPageController #filterRouting - throwable:", throwable, " room:", room);

                    if (!throwable) {
                        //TEST
                        console.log("currentUser.getRoomIdSet().contains(roomId):", currentUser.getRoomIdSet().contains(roomId));


                        if (currentUser.getRoomIdSet().contains(roomId)) {
                            routingRequest.accept();
                        } else {
                            _this.roomManagerModule.joinRoom(roomId, function(throwable) {
                                //TEST
                                console.log("RoomPageController #filterRouting - joinRoom return - throwable:", throwable);

                                if (!throwable) {
                                    routingRequest.accept();
                                } else {
                                    console.log(throwable.message);
                                    console.log(throwable.stack);
                                    routingRequest.reject();
                                }
                            });
                        }
                    } else {
                        //TODO BRN: Handle
                        console.log(throwable.message);
                        console.log(throwable.stack);
                        routingRequest.reject();
                    }
                });
            } else {
                console.log(throwable.message);
                console.log(throwable.stack);
                routingRequest.reject(); //OR forward to home?
            }
        });
    }
});

bugmeta.annotate(RoomPageController).with(
    controller().route("room/:id")
);

bugmeta.annotate(RoomPageController).with(
    autowired().properties([
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomPageController", RoomPageController);
