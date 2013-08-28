//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AddRoomMemberButtonContainer')

//@Require('Class')
//@Require('airbug.AddRoomMemberContainer')
//@Require('airbug.BoxWithFooterView')
//@Require('airbug.ButtonDropdownView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.DropdownItemView')
//@Require('airbug.IconView')
//@Require('airbug.ParagraphView')
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
var AddRoomMemberContainer  = bugpack.require('airbug.AddRoomMemberContainer');
var BoxWithFooterView       = bugpack.require('airbug.BoxWithFooterView');
var ButtonDropdownView      = bugpack.require('airbug.ButtonDropdownView');
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var DropdownItemView        = bugpack.require('airbug.DropdownItemView');
var IconView                = bugpack.require('airbug.IconView');
var ParagraphView           = bugpack.require('airbug.ParagraphView');
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

var AddRoomMemberButtonContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.roomModel          = roomModel;
        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule   = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView         = null;
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
            view(ButtonDropdownView)
                .id("addRoomMemberButtonView")
                .children([
                    view(IconView)
                        .attributes({type: IconView.Type.PLUS, color: IconView.Color.WHITE})
                        .appendTo('*[id|="button"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.addRoomMemberContainer        = new AddRoomMemberContainer(this.roomModel);
        this.addContainerChild(this.addRoomMemberContainer,   "#dropdown-list-" + this.buttonView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.$el.find("li:first-child").addClass("add-roommember-container");
        this.buttonView.$el.find("ul").addClass("span2");
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        console.log("Inside AddRoomMemberButtonContainer#hearButtonClickedEvent");
        console.log("viewTop:", this.getViewTop());
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AddRoomMemberButtonContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AddRoomMemberButtonContainer", AddRoomMemberButtonContainer);
