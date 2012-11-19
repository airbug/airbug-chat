//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomChatBoxContainer')

//@Require('BoxWithHeaderView')
//@Require('CarapaceContainer')
//@Require('ChatWidgetContainer')
//@Require('Class')
//@Require('ConversationModel')
//@Require('RoomNamePanelContainer')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomChatBoxContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetContainer}
         */
        this.chatWidgetContainer = null;

        /**
         * @private
         * @type {RoomNamePanelContainer}
         */
        this.roomNamePanelContainer = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderView}
         */
        this.boxWithHeaderView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:


    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationModel = new ConversationModel({}, "conversationModel");
        this.addModel(this.conversationModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView = view(BoxWithHeaderView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxWithHeaderView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetContainer = new ChatWidgetContainer(this.conversationModel);
        this.roomNamePanelContainer = new RoomNamePanelContainer(this.roomModel);
        this.addContainerChild(this.chatWidgetContainer, "#box-body-" + this.boxWithHeaderView.cid);
        this.addContainerChild(this.roomNamePanelContainer, "#box-header-" + this.boxWithHeaderView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomModel.bind('change:conversationUuid', this.handleRoomModelChangeConversationUuid, this);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationUuid
     */
    loadConversationModel: function(conversationUuid) {
        // TODO BRN: Load the Conversation associated with the passed in uuid.
        // TODO BRN: Send the conversation uuid and the conversationModel to the API. It's the API's responsibility to change the model

        this.conversationModel.set("uuid", conversationUuid);

        if (conversationUuid === "bn6LPsd") {

        } else if (conversationUuid === "PLn865D") {

        }
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleRoomModelChangeConversationUuid: function() {
        this.loadConversationModel(this.roomModel.get('conversationUuid'));
    }
});
