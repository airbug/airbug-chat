//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomChatBoxContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.MultiColumnView')
//@Require('airbug.PanelView')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomNameView')
//@Require('airbug.RoomOptionsDropdownButtonContainer')
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('airbug.SubheaderView')
//@Require('airbug.TwoColumnView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
    var MultiColumnView                         = bugpack.require('airbug.MultiColumnView');
    var PanelView                               = bugpack.require('airbug.PanelView');
    var RoomMemberListPanelContainer            = bugpack.require('airbug.RoomMemberListPanelContainer');
    var RoomNameView                            = bugpack.require('airbug.RoomNameView');
    var RoomOptionsDropdownButtonContainer      = bugpack.require('airbug.RoomOptionsDropdownButtonContainer');
    var RoomsHamburgerButtonContainer           = bugpack.require('airbug.RoomsHamburgerButtonContainer');
    var SubheaderView                           = bugpack.require('airbug.SubheaderView');
    var TwoColumnView                           = bugpack.require('airbug.TwoColumnView');
    var AutowiredTag                     = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                      = bugpack.require('bugioc.PropertyTag');
    var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
    var ModelBuilder                            = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                               = AutowiredTag.autowired;
    var bugmeta                                 = BugMeta.context();
    var model                                   = ModelBuilder.model;
    var property                                = PropertyTag.property;
    var view                                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RoomChatBoxContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RoomChatBoxContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomModel} roomModel
         */
        _constructor: function(roomModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
             * @type {RoomMemberListPanelContainer}
             */
            this.roomMemberListPanelContainer           = null;

            /**
             * @private
             * @type {RoomOptionsDropdownButtonContainer}
             */
            this.roomOptionsDropdownButtonContainer     = null;

            /**
             * @private
             * @type {RoomsHamburgerButtonContainer}
             */
            this.roomsHamburgerButtonContainer          = null;


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

            /**
             * @private
             * @type {SubheaderView}
             */
            this.roomChatBoxSubheaderView               = null;

            /**
             * @private
             * @type {TwoColumnView}
             */
            this.roomChatBoxTwoColumnView               = null;
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
        // CarapaceContainer Methods
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

            model(ConversationModel)
                .name("conversationModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(BoxWithHeaderView)
                .name("boxWithHeaderView")
                .attributes({
                    classes: "room-chatbox-header"
                })
                .children([
                    view(PanelView)
                        .appendTo("#box-header-{{cid}}")
                        .attributes({
                            classes: "panel-overflow"
                        })
                        .children([
                            view(SubheaderView)
                                .name("roomChatBoxSubheaderView")
                                .appendTo("#panel-body-{{cid}}")
                                .children([
                                    view(RoomNameView)
                                        .model(this.roomModel)
                                        .appendTo("#subheader-center-{{cid}}")
                                        .attributes({
                                            classes: "room-header-title"
                                        })
                                ])
                        ]),
                    view(TwoColumnView)
                        .name("roomChatBoxTwoColumnView")
                        .attributes({
                            rowStyle: MultiColumnView.RowStyle.FLUID,
                            configuration: TwoColumnView.Configuration.EXTRA_THICK_RIGHT_SMALL
                        })
                        .appendTo("#box-body-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxWithHeaderView);
            this.addModel(this.roomModel);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.chatWidgetContainer                    = new ChatWidgetContainer(this.conversationModel);
            this.roomsHamburgerButtonContainer          = new RoomsHamburgerButtonContainer();
            this.roomMemberListPanelContainer           = new RoomMemberListPanelContainer(this.roomModel);
            this.roomOptionsDropdownButtonContainer     = new RoomOptionsDropdownButtonContainer(this.roomModel);

            this.addContainerChild(this.chatWidgetContainer,                "#column2of2-" + this.roomChatBoxTwoColumnView.getCid());
            this.addContainerChild(this.roomOptionsDropdownButtonContainer, "#subheader-right-" + this.roomChatBoxSubheaderView.getCid());
            this.addContainerChild(this.roomsHamburgerButtonContainer,      "#subheader-left-" + this.roomChatBoxSubheaderView.getCid());
            this.addContainerChild(this.roomMemberListPanelContainer,       "#column1of2-" + this.roomChatBoxTwoColumnView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.roomModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeRoomModelClearChange, this);
            this.roomModel.unobserve(SetPropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdSetPropertyChange, this);
            this.roomModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdRemovePropertyChange, this);
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
                    throw throwable;
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Model Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeConversationIdRemovePropertyChange: function(observation) {
            this.clearConversation();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeConversationIdSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearConversation();
            this.loadConversation(change.getPropertyValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomModelClearChange: function(observation) {
            this.clearConversation();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomChatBoxContainer).with(
        autowired().properties([
            property("conversationManagerModule").ref("conversationManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomChatBoxContainer", RoomChatBoxContainer);
});
