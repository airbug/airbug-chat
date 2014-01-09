//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomChatBoxContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.LeaveRoomButtonContainer')
//@Require('airbug.MultiColumnView')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomNameView')
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('airbug.ShareRoomButtonContainer')
//@Require('airbug.SubheaderView')
//@Require('airbug.TwoColumnView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var ClearChange                             = bugpack.require('ClearChange');
var RemovePropertyChange                    = bugpack.require('RemovePropertyChange');
var SetPropertyChange                       = bugpack.require('SetPropertyChange');
var BoxWithHeaderView                       = bugpack.require('airbug.BoxWithHeaderView');
var ChatWidgetContainer                     = bugpack.require('airbug.ChatWidgetContainer');
var ConversationModel                       = bugpack.require('airbug.ConversationModel');
var LeaveRoomButtonContainer                = bugpack.require('airbug.LeaveRoomButtonContainer');
var MultiColumnView                         = bugpack.require('airbug.MultiColumnView');
var RoomMemberListPanelContainer            = bugpack.require('airbug.RoomMemberListPanelContainer');
var RoomNameView                            = bugpack.require('airbug.RoomNameView');
var RoomsHamburgerButtonContainer           = bugpack.require('airbug.RoomsHamburgerButtonContainer');
var ShareRoomButtonContainer                = bugpack.require('airbug.ShareRoomButtonContainer');
var SubheaderView                           = bugpack.require('airbug.SubheaderView');
var TwoColumnView                           = bugpack.require('airbug.TwoColumnView');
var AutowiredAnnotation                     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                               = AutowiredAnnotation.autowired;
var bugmeta                                 = BugMeta.context();
var property                                = PropertyAnnotation.property;
var view                                    = ViewBuilder.view;


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
         * @private
         * @type {ConversationManagerModule}
         */
        this.conversationManagerModule              = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetContainer}
         */
        this.chatWidgetContainer                    = null;

        /**
         * @private
         * @type {LeaveRoomButtonContainer}
         */
        this.leaveRoomButtonContainer               = null;

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

        /**
         * @private
         * @type {ShareRoomButtonContainer}
         */
        this.shareRoomButtonContainer               = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel                      = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel                              = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderView}
         */
        this.boxWithHeaderView                      = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ConversationModel}
     */
    getConversationModel: function() {
        return this.conversationModel;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        if (this.roomModel.getProperty("conversationId")) {
            this.loadConversation(this.roomModel.getProperty("conversationId"));
        }
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationModel      = this.conversationManagerModule.generateConversationModel({});


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView =
            view(BoxWithHeaderView)
                .children([
                    view(SubheaderView)
                    .id("room-chatbox-header")
                    .appendTo(".box-header")
                    .children([
                        view(RoomNameView)
                            .model(this.roomModel)
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
        this.chatWidgetContainer                    = new ChatWidgetContainer(this.conversationModel);
        this.leaveRoomButtonContainer               = new LeaveRoomButtonContainer(this.roomModel);
        this.roomsHamburgerButtonContainer          = new RoomsHamburgerButtonContainer();
        this.roomMemberListPanelContainer           = new RoomMemberListPanelContainer(this.roomModel);
        this.shareRoomButtonContainer               = new ShareRoomButtonContainer(this.roomModel);

        this.addContainerChild(this.chatWidgetContainer,            "#room-chatbox-row-container>.column2of2");
        this.addContainerChild(this.leaveRoomButtonContainer,       ".subheader-right");
        this.addContainerChild(this.roomsHamburgerButtonContainer,  ".subheader-left");
        this.addContainerChild(this.roomMemberListPanelContainer,   "#room-chatbox-row-container>.column1of2");
        this.addContainerChild(this.shareRoomButtonContainer,       ".subheader-center")
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomModel.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomModelClearChange, this);
        this.roomModel.observe(SetPropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdSetPropertyChange, this);
        this.roomModel.observe(RemovePropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdRemovePropertyChange, this);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    clearConversation: function() {
        this.conversationModel.clear();
    },

    /**
     * @protected
     * @param {string} conversationId
     */
    loadConversation: function(conversationId) {
        var _this = this;
        this.conversationManagerModule.retrieveConversation(conversationId, function(throwable, conversationMeldDocument) {
            if (!throwable) {
                if (conversationMeldDocument) {
                    _this.conversationModel.setConversationMeldDocument(conversationMeldDocument);
                }
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
     * @param {RemovePropertyChange} change
     */
    observeConversationIdRemovePropertyChange: function(change) {
        this.clearConversation();
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeConversationIdSetPropertyChange: function(change) {
        this.clearConversation();
        this.loadConversation(change.getPropertyValue());
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeRoomModelClearChange: function(change) {
        this.clearConversation();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomChatBoxContainer).with(
    autowired().properties([
        property("conversationManagerModule").ref("conversationManagerModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomChatBoxContainer", RoomChatBoxContainer);
