//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomChatPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.RoomChatPageContainer')
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
var RoomChatPageContainer   = bugpack.require('airbug.RoomChatPageContainer');
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

var RoomChatPageController = Class.extend(ApplicationController, {

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
         * @type {RoomChatPageController}
         */
        this.roomChatPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.roomChatPageContainer = new RoomChatPageContainer();
        this.setContainerTop(this.roomChatPageContainer);
    },

    /**
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        this._super(routingRequest);
        if(!this.currentUserManagerModule.currentUser){
            routingRequest.forward("");
        } else if(!this.currentUserManagerModule.currentUser.email){
            routingRequest.forward("");
        } else {
            this.currentUserManagerModule.getCurrentUser(function(error, currentUser){
                if(!error && currentUser){
                    var roomsList   = currentUser.roomsList;
                    var roomId      = routingRequest.getArgs()[0];
                    console.log("roomsList:", roomsList, "roomId:", roomId);
                    if(roomsList.indexOf(roomId) > -1){
                        routingRequest.accept();
                    } else {
                        routingRequest.reject(); //OR forward to home?
                    }
                } else {
                    routingRequest.reject(); //OR forward to home?
                }
            });
        }
    }

});
annotate(RoomChatPageController).with(
    controller().route("room/:id")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomChatPageController", RoomChatPageController);
