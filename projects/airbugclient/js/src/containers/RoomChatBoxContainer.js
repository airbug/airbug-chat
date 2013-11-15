//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomChatBoxContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.LeaveRoomButtonContainer')
//@Require('airbug.MultiColumnView')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('airbug.SubHeaderView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
var BoxWithHeaderView               = bugpack.require('airbug.BoxWithHeaderView');
var ChatWidgetContainer             = bugpack.require('airbug.ChatWidgetContainer');
var ConversationModel               = bugpack.require('airbug.ConversationModel');
var LeaveRoomButtonContainer        = bugpack.require('airbug.LeaveRoomButtonContainer');
var MultiColumnView                 = bugpack.require('airbug.MultiColumnView');
var RoomMemberListPanelContainer    = bugpack.require('airbug.RoomMemberListPanelContainer');
var RoomsHamburgerButtonContainer   = bugpack.require('airbug.RoomsHamburgerButtonContainer');
var SubHeaderView                   = bugpack.require('airbug.SubHeaderView');
var TextView                        = bugpack.require('airbug.TextView');
var TwoColumnView                   = bugpack.require('airbug.TwoColumnView');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


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

        /**
         *
         */
        this.conversationManagerModule      = null;

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetContainer}
         */
        this.chatWidgetContainer            = null;

        /**
         * @private
         * @type {LeaveRoomButtonContainer}
         */
        this.leaveRoomButtonContainer       = null;

        /**
         * @private
         * @type {RoomMemberListPanelContainer}
         */
        this.roomMemberListPanelContainer   = null;

        /**
         * @private
         * @type {RoomsHamburgerButtonContainer}
         */
        this.roomsHamburgerButtonContainer  = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel          = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                  = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderView}
         */
        this.boxWithHeaderView          = null;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        this.roomModel.bind('change:conversationId', this.handleRoomModelChangeConversationId, this);
        if (this.roomModel.get("conversationId")) {
            this.loadConversationModel(this.roomModel.get("conversationId"));
        }
    },

    /**
     * @protected
     */
    createContainer: function() {
        var _this = this;
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationModel  = new ConversationModel({});
        this.addModel("conversation", this.conversationModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView =
            view(BoxWithHeaderView)
                .children([
                    view(SubHeaderView)
                    .id("room-chatbox-header")
                    .appendTo(".box-header")
                    .children([
                        view(TextView)
                            .attributes({text: this.roomModel.get("name")})
                            .appendTo('.subheader-center')
                    ]),
                    view(TwoColumnView)
                        .id("room-chatbox-row-container")
                        .attributes({
                            rowStyle: MultiColumnView.RowStyle.FLUID,
                            configuration: TwoColumnView.Configuration.THICK_RIGHT
                        })
                        .appendTo(".box-body")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxWithHeaderView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.leaveRoomButtonContainer               = new LeaveRoomButtonContainer(this.roomModel);
        this.roomsHamburgerButtonContainer          = new RoomsHamburgerButtonContainer();
        this.roomMemberListPanelContainer           = new RoomMemberListPanelContainer(this.roomModel);
        this.chatWidgetContainer                    = new ChatWidgetContainer(this.conversationModel);

        this.addContainerChild(this.leaveRoomButtonContainer,       ".subheader-right");
        this.addContainerChild(this.roomsHamburgerButtonContainer,  ".subheader-left");
        this.addContainerChild(this.roomMemberListPanelContainer,   ".column1of2");
        this.addContainerChild(this.chatWidgetContainer,            ".column2of2");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationId
     */
    loadConversationModel: function(conversationId) {
        var _this = this;
        this.conversationManagerModule.retrieveConversation(conversationId, function(throwable, conversationMeldDocument) {
            if (!throwable) {
                _this.conversationModel.setMeldDocument(conversationMeldDocument);
            } else {
                //TODO: Either show an error panel or automatically retry the call
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleRoomModelChangeConversationId: function() {
        this.loadConversationModel(this.roomModel.get('conversationId'));
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomChatBoxContainer).with(
    autowired().properties([
        property("conversationManagerModule").ref("conversationManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomChatBoxContainer", RoomChatBoxContainer);
