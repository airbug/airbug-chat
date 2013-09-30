//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomPageContainer')

//@Require('Class')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.PageContainer')
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
var HomeButtonContainer                     = bugpack.require('airbug.HomeButtonContainer');
var LogoutButtonContainer                   = bugpack.require('airbug.LogoutButtonContainer');
var PageContainer                           = bugpack.require('airbug.PageContainer');
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

var RoomPageContainer = Class.extend(PageContainer, {

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


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @type {airbug.NavigationModule}
         */
        this.navigationModule                       = null;

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

            // Done by PageContainer

        // Wire Up Views
        //-------------------------------------------------------------------------------

            // Done by PageContainer
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
        this.addContainerChild(this.roomListPanelContainer,         ".column1of4");
        this.addContainerChild(this.roomChatBoxContainer,           ".column2of4");
        // this.addContainerChild(this.createRoomButtonContainer, "");
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} roomId
     */
    loadRoomModel: function(roomId) {
        console.log("Loading roomModel inside of RoomPageContainer#loadRoomModel");
        var _this = this;
        this.roomModel = new RoomModel({});
        this.addModel(roomId, this.roomModel);
        //TODO start loading animation
        // var blackoutLoaderContainer = new BlackoutLoaderContainer();
        // this.addContainerChild(blackoutLoaderContainer);

        this.roomManagerModule.retrieveRoom(roomId, function(error, roomMeldObj){
            if(!error && roomMeldObj){
                _this.roomModel.setMeldObject(roomMeldObj);
                //TODO stop loading animation
            } else {
                //TODO
                // retry mechanism
                var notificationView    = _this.getNotificationView();
                console.log("error:", error);
                notificationView.flashError(error);
                notificationView.flashError("This room is currently unavailable. You will be redirected to your user homepage");
                setTimeout(function(){
                    _this.navigationModule.navigate("home", {trigger: true});
                }, 1500);
            }
        });
    }
});

bugmeta.annotate(RoomPageContainer).with(
    autowired().properties([
        property("roomManagerModule").ref("roomManagerModule"),
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomPageContainer", RoomPageContainer);
