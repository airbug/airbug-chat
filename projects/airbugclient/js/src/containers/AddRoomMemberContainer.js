//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AddRoomMemberContainer')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.DropdownItemView')
//@Require('airbug.IconView')
//@Require('airbug.ParagraphView')
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
var ButtonView              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var DropdownItemView        = bugpack.require('airbug.DropdownItemView');
var IconView                = bugpack.require('airbug.IconView');
var ParagraphView           = bugpack.require('airbug.ParagraphView');
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

var AddRoomMemberContainer = Class.extend(CarapaceContainer, {

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
         * @type {DropdownItemView}
         */
        this.dropdownItemView   = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.copyLinkButton     = null;
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

        this.dropdownItemView =
            view(DropdownItemView)
                .children([
                    view(ParagraphView)
                        .attributes({text: this.roomModel.get("name")}),
                    view(ParagraphView)
                        .attributes({text: "Share this room"}),
                    view(ParagraphView)
                        .attributes({text: "http://airbug.com/app#room/" + this.roomModel.get("_id")}),
                    view(ButtonView)
                        .attributes({text: "Copy Link", type: "primary", align: "left"})
                ])
            .build();




        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.dropdownItemView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        // this.copyLinkButton = new CopyLinkButton("http://airbug.com/app#room/" + this.roomModel.get("_id"));
        // this.addContainerChild(this.copyLinkButton, "")
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {

    }
});

annotate(AddRoomMemberContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AddRoomMemberContainer", AddRoomMemberContainer);
