//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberListPanelContainer')

//@Require('ButtonView')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('PanelWithHeaderView')
//@Require('RoomMemberListContainer')
//@Require('TextView')
//@Require('ViewBuilder')


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
        this.roomModel = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.addRoomMemberButtonView = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberListContainer}
         */
        this.roomMemberListContainer = null;
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
                .children([
                    view(ButtonView)
                        .id("addRoomMemberButtonView")
                        .attributes({size: ButtonView.Size.SMALL})
                        .appendTo('*[id|="panel-header-nav"]')
                        .children([
                            view(TextView)
                                .attributes({text: "+"})
                                .appendTo('*[id|="button"]')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.addRoomMemberButtonView = this.findViewById("addRoomMemberButtonView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.roomMemberListContainer = new RoomMemberListContainer(this.roomModel);
        this.addContainerChild(this.roomMemberListContainer, "#panel-body-" + this.panelView.cid);
    }
});
