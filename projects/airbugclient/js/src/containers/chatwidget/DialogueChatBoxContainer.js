//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('DialogueChatBoxContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.DialogueNameView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.OneColumnView')
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('airbug.SubheaderView')
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
var DialogueNameView                        = bugpack.require('airbug.DialogueNameView');
var MultiColumnView                         = bugpack.require('airbug.MultiColumnView');
var OneColumnView                           = bugpack.require('airbug.OneColumnView');
var RoomMemberListPanelContainer            = bugpack.require('airbug.RoomMemberListPanelContainer');
var RoomsHamburgerButtonContainer           = bugpack.require('airbug.RoomsHamburgerButtonContainer');
var SubheaderView                           = bugpack.require('airbug.SubheaderView');
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

var DialogueChatBoxContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(dialogueModel, otherUserModel) {

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
        this.chatWidgetContainer                    = null;

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
         * @type {ConversationModel}
         */
        this.conversationModel                      = null;

        /**
         * @private
         * @type {DialogueModel}
         */
        this.dialogueModel                          = dialogueModel;

        /**
         * @private
         * @type {UserModel}
         */
        this.otherUserModel                         = otherUserModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationManagerModule}
         */
        this.conversationManagerModule              = null;


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
        this.dialogueChatBoxSubheaderView           = null;

        /**
         * @private
         * @type {OneColumnView}
         */
        this.dialogueChatBoxOneColumnView           = null;
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
        if (this.dialogueModel.getProperty("conversationId")) {
            this.loadConversation(this.dialogueModel.getProperty("conversationId"));
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

        view(BoxWithHeaderView)
            .name("boxWithHeaderView")
            .children([
                view(SubheaderView)
                    .name("dialogueChatBoxSubheaderView")
                    .appendTo(".box-header")
                    .children([
                        view(DialogueNameView)
                            .model(this.otherUserModel)
                            .appendTo('#subheader-center-{{cid}}')
                    ]),
                view(OneColumnView)
                    .name("dialogueChatBoxOneColumnView")
                    .attributes({
                        rowStyle: MultiColumnView.RowStyle.FLUID,
                        configuration: OneColumnView.Configuration.FULL
                    })
                    .appendTo(".box-body")
            ])
            .build(this);


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
        this.roomsHamburgerButtonContainer          = new RoomsHamburgerButtonContainer();

        this.addContainerChild(this.chatWidgetContainer,            "#column1of1-" + this.dialogueChatBoxOneColumnView.getCid());
        this.addContainerChild(this.roomsHamburgerButtonContainer,  "#subheader-left-" + this.dialogueChatBoxSubheaderView.getCid());
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.dialogueModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeDialogueModelClearChange, this);
        this.dialogueModel.unobserve(SetPropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdSetPropertyChange, this);
        this.dialogueModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdRemovePropertyChange, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.dialogueModel.observe(ClearChange.CHANGE_TYPE, "", this.observeDialogueModelClearChange, this);
        this.dialogueModel.observe(SetPropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdSetPropertyChange, this);
        this.dialogueModel.observe(RemovePropertyChange.CHANGE_TYPE, "conversationId", this.observeConversationIdRemovePropertyChange, this);
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
    // Model Observers
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
    observeDialogueModelClearChange: function(change) {
        this.clearConversation();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(DialogueChatBoxContainer).with(
    autowired().properties([
        property("conversationManagerModule").ref("conversationManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DialogueChatBoxContainer", DialogueChatBoxContainer);