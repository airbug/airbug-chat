//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.TwoColumnView')
//@Require('airbug.RoomChatBoxContainer')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.RoomModel')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var ApplicationContainer                    = bugpack.require('airbug.ApplicationContainer');
var HomeButtonContainer                     = bugpack.require('airbug.HomeButtonContainer');
var LogoutButtonContainer                   = bugpack.require('airbug.LogoutButtonContainer');
var PageView                                = bugpack.require('airbug.PageView');
var TwoColumnView                           = bugpack.require('airbug.TwoColumnView');
var RoomChatBoxContainer                    = bugpack.require('airbug.RoomChatBoxContainer');
var RoomListPanelContainer                  = bugpack.require('airbug.RoomListPanelContainer');
var RoomModel                               = bugpack.require('airbug.RoomModel');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationListSlidePanelContainer}
         */
        this.conversationListSlidePanelContainer    = null;

        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer                    = null;

        /**
         * @private
         * @type {LeaveRoomButtonContainer}
         */
        this.leaveRoomButtonContainer               = null;

        /**
         * @private
         * @type {LogoutButtonContainer}
         */
        this.logoutButtonContainer                  = null;

        /**
         * @private
         * @type {RoomChatBoxContainer}
         */
        this.roomChatBoxContainer                   = null;

        /**
         * @private
         * @type {RoomMemberListPanelContainer}
         */
        this.roomMemberListPanelContainer           = null;

        /**
         * @private
         * @type {RoomsHamburgerButtonContainer}
         */
        this.roomsHamburgerButtonContainer          = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                              = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                      = null;

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @type {RoomManagerModule}
         */
        this.roomManagerModule                      = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
    },

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);
        console.log("routingArgs:", routingArgs);

        var roomId = routingArgs[0];

        // Create Models
        //-------------------------------------------------------------------------------

        this.loadRoomModel(roomId);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(TwoColumnView)
                    .id("roomPageRowContainer")
                    .attributes({configuration: TwoColumnView.Configuration.HAMBURGER_LEFT})
                    .appendTo(".page")
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function(routingArgs) {
        this._super(routingArgs);
        this.homeButtonContainer                    = new HomeButtonContainer();
        this.logoutButtonContainer                  = new LogoutButtonContainer();
        this.roomChatBoxContainer                   = new RoomChatBoxContainer(this.roomModel);
        this.roomListPanelContainer                 = new RoomListPanelContainer();
        // this.createRoomButtonContainer           = new CreateRoomButtonContainer();
        this.addContainerChild(this.logoutButtonContainer,          "#header-right");
        this.addContainerChild(this.homeButtonContainer,            "#header-left");
        this.addContainerChild(this.roomListPanelContainer,         ".column1of2");
        this.addContainerChild(this.roomChatBoxContainer,           ".column2of2");
        // this.addContainerChild(this.createRoomButtonContainer, "");
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} uuid
     */
    loadRoomModel: function(roomId) {
        // TODO BRN: Load the Room associated with the passed in uuid.
        // TODO BRN: Send the room uuid and the roomModel to the API. It's the API's responsibility to change the model
        console.log("Loading roomModel inside of RoomPageContainer#loadRoomModel");
        var roomObj     = this.roomManagerModule.get(roomId);
        this.roomModel  = new RoomModel(roomObj, roomObj._id);
        this.addModel(this.roomModel);
    }
});

bugmeta.annotate(RoomPageContainer).with(
    autowired().properties([
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomPageContainer", RoomPageContainer);
