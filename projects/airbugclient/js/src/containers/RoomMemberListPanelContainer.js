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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Break this out in to RoomMemberListPanelContainer and RoomMemberListContainer

var RoomMemberListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher, roomModel) {

        this._super(apiPublisher);


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

        /**
         * @private
         * @type {TextView}
         */
        this.textView = null;


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

        this.addRoomMemberButtonView = new ButtonView({size: ButtonView.Size.SMALL});
        this.panelView = new PanelWithHeaderView({headerTitle: "Room Members"});
        this.textView = new TextView({text: "+"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.addRoomMemberButtonView.addViewChild(this.textView, "#button-" + this.addRoomMemberButtonView.cid);
        this.panelView.addViewChild(this.addRoomMemberButtonView, "#panel-header-nav-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.roomMemberListContainer = new RoomMemberListContainer(this.apiPublisher, this.roomModel);
        this.addContainerChild(this.roomMemberListContainer, "#panel-body-" + this.panelView.cid);
    }
});
