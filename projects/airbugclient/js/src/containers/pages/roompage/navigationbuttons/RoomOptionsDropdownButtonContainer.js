//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomOptionsDropdownButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonDropdownView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.DropdownItemDividerView')
//@Require('airbug.DropdownItemView')
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.IconView')
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
var ButtonDropdownView      = bugpack.require('airbug.ButtonDropdownView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var CommandModule           = bugpack.require('airbug.CommandModule');
var DropdownItemDividerView = bugpack.require('airbug.DropdownItemDividerView');
var DropdownItemView        = bugpack.require('airbug.DropdownItemView');
var DropdownViewEvent       = bugpack.require('airbug.DropdownViewEvent');
var IconView                = bugpack.require('airbug.IconView');
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
var RoomOptionsDropdownButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super("RoomOptionsDropdownButton");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                      = roomModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                  = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule               = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonDropdownView}
         */
        this.buttonView                     = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.leaveRoomPermanentlyButtonView = null;
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

        view(ButtonDropdownView)
            .name("buttonView")
            .attributes({type: "primary", align: "right"})
            .children([
                view(IconView)
                    .attributes({
                        type: IconView.Type.CHEVRON_DOWN,
                        color: IconView.Color.WHITE
                    })
                    .appendTo("button"),
                view(DropdownItemView)
                    .name("leaveRoomPermanentlyButtonView")
                    .appendTo("#dropdown-list-{{cid}}")
                    .children([
                        view(TextView)
                            .appendTo("a")
                            .attributes({text: "Leave room permanently"})
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },

    initializeEventListeners: function() {
        this._super();
        this.leaveRoomPermanentlyButtonView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLeaveRoomPermanentlyButtonClickedEvent, this);
    },

    deinitializeEventListeners: function() {
        this._super();
        this.leaveRoomPermanentlyButtonView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLeaveRoomPermanentlyButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    hearLeaveRoomPermanentlyButtonClickedEvent: function() {
        var _this = this;
        this.roomManagerModule.leaveRoom(this.roomModel.getProperty("id"), function(throwable){
            if(throwable) {
                _this.commandModule.relayCommand(CommandModule.CommandType.FLASH.ERROR, {message: "Unable to leave room permanently because " + throwable.getMessage()});
            }
            _this.navigationModule.navigate("home", {
                trigger: true
            });
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomOptionsDropdownButtonContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomOptionsDropdownButtonContainer", RoomOptionsDropdownButtonContainer);
