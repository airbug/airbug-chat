//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ExitRoomButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var TextView                = bugpack.require('airbug.TextView');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
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

/**
 * @constructor
 * @extends {ButtonContainer}
 */
var ExitRoomButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super("ExitRoomButton");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                  = roomModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule           = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView                 = null;
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

        this.buttonView =
            view(ButtonView)
                .attributes({type: "primary", align: "right"})
                .children([
                    view(TextView)
                        .attributes({text: "Exit"})
                        .appendTo('button[id|="button"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearExitRoomButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearExitRoomButtonClickedEvent: function(event) {
        this.navigationModule.navigate("home", {
            trigger: true
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ExitRoomButtonContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ExitRoomButtonContainer", ExitRoomButtonContainer);
