//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.RoomPageContainer')
//@Require('annotate.Annotate')
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
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var annotation  = Annotate.annotation;
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
        this.preFilterRouting(routingRequest, function(error, currentUser, loggedIn){
            if(loggedIn){
                if(!error && currentUser){
                    var roomsList   = currentUser.roomsList;
                    var roomId      = routingRequest.getArgs()[0];
                    console.log("roomsList:", roomsList, "roomId:", roomId);
                    if(roomsList.indexOf(roomId) > -1 && _this.roomManagerModule.get(roomId)){
                        routingRequest.accept();
                    } else {
                        _this.roomManagerModule.joinRoom(roomId, function(error, room){
                            if(!error && room){
                                routingRequest.accept();
                            } else {
                                routingRequest.reject(); //OR forward to home?
                            }
                        });
                    }
                } else {
                    routingRequest.reject(); //OR forward to home?
                }
            }
        });
    }
});

annotate(RoomPageController).with(
    controller().route("room/:id")
);

annotate(RoomPageController).with(
    autowired().properties([
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomPageController", RoomPageController);
