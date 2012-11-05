//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageContainer')

//@Require('AccountButtonContainer')
//@Require('ApplicationContainer')
//@Require('ChatModel')
//@Require('Class')
//@Require('ConversationListPanelContainer')
//@Require('HomeButtonContainer')
//@Require('PageThreeColumnView')
//@Require('RoomChatBoxContainer')
//@Require('RoomMemberListPanelContainer')
//@Require('RoomModel')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AccountButtonContainer}
         */
        this.accountButtonContainer = null;

        /**
         * @private
         * @type {ConversationListPanelContainer}
         */
        this.conversationListPanelContainer = null;

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

        this.roomModel = new RoomModel();
        this.addModel(this.roomModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageThreeColumnView = new PageThreeColumnView({configuration: PageThreeColumnView.Configuration.THIN_RIGHT});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageThreeColumnView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.accountButtonContainer = new AccountButtonContainer(this.apiPublisher);
        this.conversationListPanelContainer = new ConversationListPanelContainer(this.apiPublisher);
        this.homeButtonContainer = new HomeButtonContainer(this.apiPublisher);
        this.roomChatBoxContainer = new RoomChatBoxContainer(this.apiPublisher, this.roomModel);
        this.roomMemberListPanelContainer = new RoomMemberListPanelContainer(this.apiPublisher, this.roomModel);
        this.addContainerChild(this.accountButtonContainer, '#header-right');
        this.addContainerChild(this.conversationListPanelContainer, "#page-rightrow");
        this.addContainerChild(this.homeButtonContainer, "#header-left");
        this.addContainerChild(this.roomChatBoxContainer, "#page-centerrow");
        this.addContainerChild(this.roomMemberListPanelContainer, "#page-leftrow");
    },

    /**
     * @protected
     */
    deactivateContainer: function() {
        this._super();
        this.roomModel = null;
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
        this.roomModel.set("uuid", uuid);
        if (uuid === "g13Dl0s") {
            this.roomModel.set("name", "airbug Company Room");
            this.roomModel.set("conversationUuid", "bn6LPsd");
        } else if (uuid === "nb0psdf") {
            this.roomModel.set("name", "airbug Dev Room");
            this.roomModel.set("conversationUuid", "PLn865D");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ChatListPanelEvent} event
     */
    hearChatSelectedEvent: function(event) {
        var chat = event.getData();
        var context = chat.context;
        if (context.type === "contact") {
            this.navigate("contact/" + context.uid, {trigger: true});
        } else if (context.type === "room") {
            this.navigate("room/" + context.uid, {trigger: true});
        } else {
            throw new Error("unrecognized chat context type");
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    hearHomeButtonClickedEvent: function(event) {
        this.navigate("", {trigger: true});
    },

    /**
     * @private
     * @param {Event} event
     */
    hearRoomMemberSelected: function(event) {
        var roomMember = event.getData();
        this.navigate("contact/" + roomMember.uid, {trigger: true});
    }
});
