//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListPanelContainer')

//@Require('Class')
//@Require('airbug.AddRoomMemberButtonContainer')
//@Require('airbug.ButtonView')
//@Require('airbug.ListView')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.RoomMemberListContainer')
//@Require('airbug.TextView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var AddRoomMemberButtonContainer    = bugpack.require('airbug.AddRoomMemberButtonContainer');
var ButtonView                      = bugpack.require('airbug.ButtonView');
var ListView                        = bugpack.require('airbug.ListView');
var PanelWithHeaderView             = bugpack.require('airbug.PanelWithHeaderView');
var RoomMemberListContainer         = bugpack.require('airbug.RoomMemberListContainer');
var TextView                        = bugpack.require('airbug.TextView');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Break this out in to RoomMemberListPanelContainer and RoomMemberListContainer

var RoomMemberListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                  = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        // this.addRoomMemberButtonView    = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView                  = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberListContainer}
         */
        this.roomMemberListContainer    = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Room Members"})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.roomMemberListContainer        = new RoomMemberListContainer(this.roomModel);
        this.addRoomMemberButtonContainer   = new AddRoomMemberButtonContainer(this.roomModel);
        this.addContainerChild(this.addRoomMemberButtonContainer,   "#panel-header-nav-" + this.panelView.cid);
        this.addContainerChild(this.roomMemberListContainer,        "#panel-body-" + this.panelView.cid);
    },

    initializeContainer: function() {
        this._super();
        this.addRoomMemberButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearAddRoomMemberButtonClickedEvent, this);

    },

    hearAddRoomMemberButtonClickedEvent: function() {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListPanelContainer", RoomMemberListPanelContainer);
