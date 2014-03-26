//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListPanelContainer')

//@Require('Class')
//@Require('airbug.AddRoomMemberButtonContainer')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
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
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
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
         * @type {PanelView}
         */
        this.panelView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AddRoomMemberButtonContainer}
         */
        this.addRoomMemberButtonContainer   = null;

        /**
         * @private
         * @type {RoomMemberListContainer}
         */
        this.roomMemberListContainer        = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        view(PanelWithHeaderView)
            .name("panelView")
            .attributes({
                classes: "roommember-list-panel",
                headerTitle: "Participants"
            })
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.addRoomMemberButtonContainer   = new AddRoomMemberButtonContainer(this.roomModel);
        this.roomMemberListContainer        = new RoomMemberListContainer(this.roomModel);
        this.addContainerChild(this.roomMemberListContainer, "#panel-body-" + this.panelView.getCid());
        this.addContainerChild(this.addRoomMemberButtonContainer, "#panel-header-nav-right-" + this.panelView.getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListPanelContainer", RoomMemberListPanelContainer);
