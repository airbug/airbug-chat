//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CreateRoomFormContainer')

//@Require('Class')
//@Require('airbug.CreateRoomFormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.RoomModel')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var CreateRoomFormView      = bugpack.require('airbug.CreateRoomFormView');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var RoomModel               = bugpack.require('airbug.RoomModel');
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CreateRoomFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule   = null;

       /**
         * @private
         * @type {RoomManagerModule}
         */
        this.roomManagerModule  = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CreateRoomFormView}
         */
        this.createRoomFormView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.createRoomFormView =
            view(CreateRoomFormView)
                // .attributes({type: "primary", align: "left"})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.createRoomFormView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.createRoomFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearFormSubmittedEvent: function(event) {
        var _this       = this;
        var room        = event.getData();
        this.roomManagerModule.createRoom(room, function(error, room){
            if(!error){
                // _this.roomCollection.add(new RoomModel(room));
                _this.navigationModule.navigate("room/" + room.id, {
                    trigger: true
                });
            } else {
                //TODO
                console.log("roomManagerModule#createRoom callback error:", error);
            }
        });
    }
});
annotate(CreateRoomFormContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CreateRoomFormContainer", CreateRoomFormContainer);
