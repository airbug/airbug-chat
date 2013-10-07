//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CreateRoomFormContainer')

//@Require('Class')
//@Require('airbug.CreateRoomFormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
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

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.createRoomFormView.$el.find("input")[0].focus();
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
        var formData     = event.getData().formData;
        this.roomManagerModule.createRoom(formData, function(throwable, roomMeldDocument) {

            console.log("Inside of CreateRoomFormContainer#hearFormSubmittedEvent roomManagerModule#createRoom callback");
            console.log("Throwable:", throwable, "roomMeldDocument:", roomMeldDocument);

            if (!throwable) {
                var roomId = roomMeldDocument.getData().id;
                _this.navigationModule.navigate("room/" + roomId, {
                    trigger: true
                });
            } else {
                var parentContainer     = _this.getContainerParent();
                var notificationView    = parentContainer.getNotificationView();
                console.log("roomManagerModule#createRoom callback throwable:", throwable);
                notificationView.flashError(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CreateRoomFormContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CreateRoomFormContainer", CreateRoomFormContainer);
