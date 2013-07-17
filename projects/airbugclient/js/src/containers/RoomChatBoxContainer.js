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
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('airbug.SubHeaderView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var RoomsHamburgerButtonContainer   = bugpack.require('airbug.RoomsHamburgerButtonContainer');
var SubHeaderView                   = bugpack.require('airbug.SubHeaderView');
var TextView                        = bugpack.require('airbug.TextView');
var TwoColumnView                   = bugpack.require('airbug.TwoColumnView');
var Annotate                        = bugpack.require('annotate.Annotate');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
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

        this.conversationManagerModule  = null;

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
        this.boxWithHeaderView                    = null;
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
        //TODO BRN:

        this.roomModel.bind('change:conversationId', this.handleRoomModelChangeConversationId, this);


    },

    /**
     * @protected
     */
    createContainer: function() {
        var _this = this;
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------
        var conversationId      = this.roomModel.get("conversationId"); //undefined because the returned room from create room does not have conversationid on it!!
        this.conversationModel  = new ConversationModel({}, conversationId);
        this.addModel(this.conversationModel);
        this.conversationManagerModule.retrieveConversation(conversationId, function(error, conversationObj){
            if(!error && conversationObj){
                _this.conversationModel.set(conversationObj);
            }
        });


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView = 
            view(BoxWithHeaderView)
                .children([
                    view(SubHeaderView)
                    .id("roomChatBoxHeader")
                    .appendTo(".box-header")
                    .children([
                        view(TextView)
                            .attributes({text: this.roomModel.get("name")})
                            .appendTo('.subheader-center')
                    ]),
                    view(TwoColumnView)
                        .id("roomChatBoxRowContainer")
                        .attributes({configuration: TwoColumnView.Configuration.THICK_RIGHT})
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
     * @param {string} conversationUuid
     */
    loadConversationModel: function(conversationUuid) {
        // TODO BRN: Load the Conversation associated with the passed in uuid.
        // TODO BRN: Send the conversation uuid and the conversationModel to the API. It's the API's responsibility to change the model


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

annotate(RoomChatBoxContainer).with(
    autowired().properties([
        property("conversationManagerModule").ref("conversationManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomChatBoxContainer", RoomChatBoxContainer);
