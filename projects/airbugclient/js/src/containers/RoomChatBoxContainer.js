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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomChatBoxContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher, roomModel) {

        this._super(apiPublisher);


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

        this.conversationModel = new ConversationModel({});
        this.addModel(this.conversationModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView = new BoxWithHeaderView({});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxWithHeaderView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetContainer = new ChatWidgetContainer(this.apiPublisher, this.conversationModel);
        this.roomNamePanelContainer = new RoomNamePanelContainer(this.apiPublisher, this.roomModel);
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

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.conversationModel = null;
        this.roomModel = null;
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
