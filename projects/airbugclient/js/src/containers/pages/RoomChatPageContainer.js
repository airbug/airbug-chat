//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomChatPageContainer')

//@Require('Class')
//@Require('airbug.AccountButtonDropdownContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.ConversationListSlidePanelContainer')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.PageThreeColumnView')
//@Require('airbug.RoomChatBoxContainer')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomModel')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                                 bugpack.require('Class');
var AccountButtonDropdownContainer =        bugpack.require('airbug.AccountButtonDropdownContainer');
var ApplicationContainer =                  bugpack.require('airbug.ApplicationContainer');
var ConversationListSlidePanelContainer =   bugpack.require('airbug.ConversationListSlidePanelContainer');
var HomeButtonContainer =                   bugpack.require('airbug.HomeButtonContainer');
var PageThreeColumnView =                   bugpack.require('airbug.PageThreeColumnView');
var RoomChatBoxContainer =                  bugpack.require('airbug.RoomChatBoxContainer');
var RoomMemberListPanelContainer =          bugpack.require('airbug.RoomMemberListPanelContainer');
var RoomModel =                             bugpack.require('airbug.RoomModel');
var ViewBuilder =                           bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomChatPageContainer = Class.extend(ApplicationContainer, {

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
         * @type {AccountButtonDropdownContainer}
         */
        this.accountButtonDropdownContainer = null;

        /**
         * @private
         * @type {ConversationListSlidePanelContainer}
         */
        this.conversationListSlidePanelContainer = null;

        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer = null;

        /**
         * @private
         * @type {RoomChatBoxContainer}
         */
        this.roomChatBoxContainer = null;

        /**
         * @private
         * @type {RoomMemberListPanelContainer}
         */
        this.roomMemberListPanelContainer = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageThreeColumnView}
         */
        this.pageThreeColumnView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        var roomUuid = routerArgs[0];
        this.loadRoomModel(roomUuid);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomModel = new RoomModel({}, "roomModel");
        this.addModel(this.roomModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageThreeColumnView =
            view(PageThreeColumnView)
                .attributes({configuration: PageThreeColumnView.Configuration.THICK_RIGHT})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageThreeColumnView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.accountButtonDropdownContainer = new AccountButtonDropdownContainer();
        this.conversationListSlidePanelContainer = new ConversationListSlidePanelContainer();
        this.homeButtonContainer = new HomeButtonContainer();
        this.roomChatBoxContainer = new RoomChatBoxContainer(this.roomModel);
        this.roomMemberListPanelContainer = new RoomMemberListPanelContainer(this.roomModel);
        this.addContainerChild(this.accountButtonDropdownContainer, '#header-right');
        this.addContainerChild(this.conversationListSlidePanelContainer, "#page-rightrow");
        this.addContainerChild(this.homeButtonContainer, "#header-left");
        this.addContainerChild(this.roomChatBoxContainer, "#page-centerrow");
        this.addContainerChild(this.roomMemberListPanelContainer, "#page-leftrow");
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} uuid
     */
    loadRoomModel: function(uuid) {
        // TODO BRN: Load the Room associated with the passed in uuid.
        // TODO BRN: Send the room uuid and the roomModel to the API. It's the API's responsibility to change the model

        //TEST
        if (uuid === "g13Dl0s") {
            this.roomModel.set({"uuid": uuid, "name": "airbug Company Room", "conversationUuid": "bn6LPsd"});
        } else if (uuid === "nb0psdf") {
            this.roomModel.set({"uuid": uuid, "name": "airbug Dev Room", "conversationUuid": "PLn865D"});
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomChatPageContainer", RoomChatPageContainer);
