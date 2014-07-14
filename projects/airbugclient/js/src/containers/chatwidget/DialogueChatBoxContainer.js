/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.DialogueChatBoxContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.DialogueNameView')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomsHamburgerButtonContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.BoxWithHeaderView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ModelBuilder')
//@Require('carapace.MultiColumnView')
//@Require('carapace.OneColumnView')
//@Require('carapace.SubheaderView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var ClearChange                     = bugpack.require('ClearChange');
    var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
    var SetPropertyChange               = bugpack.require('SetPropertyChange');
    var ChatWidgetContainer             = bugpack.require('airbug.ChatWidgetContainer');
    var ConversationModel               = bugpack.require('airbug.ConversationModel');
    var DialogueNameView                = bugpack.require('airbug.DialogueNameView');
    var RoomMemberListPanelContainer    = bugpack.require('airbug.RoomMemberListPanelContainer');
    var RoomsHamburgerButtonContainer   = bugpack.require('airbug.RoomsHamburgerButtonContainer');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var BoxWithHeaderView               = bugpack.require('carapace.BoxWithHeaderView');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ModelBuilder                    = bugpack.require('carapace.ModelBuilder');
    var MultiColumnView                 = bugpack.require('carapace.MultiColumnView');
    var OneColumnView                   = bugpack.require('carapace.OneColumnView');
    var SubheaderView                   = bugpack.require('carapace.SubheaderView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredTag.autowired;
    var bugmeta                         = BugMeta.context();
    var model                           = ModelBuilder.model;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var DialogueChatBoxContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.DialogueChatBoxContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {DialogueModel} dialogueModel
         * @param {UserModel} otherUserModel
         */
        _constructor: function(dialogueModel, otherUserModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

            model(ConversationModel)
                .name("conversationModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(BoxWithHeaderView)
                .name("boxWithHeaderView")
                .children([
                    view(SubheaderView)
                        .name("dialogueChatBoxSubheaderView")
                        .appendTo("#box-header-{{cid}}")
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
                        .appendTo("#box-body-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxWithHeaderView);
            this.addModel(this.dialogueModel);
            this.addModel(this.otherUserModel);
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
        observeDialogueModelClearChange: function(observation) {
            this.clearConversation();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(DialogueChatBoxContainer).with(
        autowired().properties([
            property("conversationManagerModule").ref("conversationManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.DialogueChatBoxContainer", DialogueChatBoxContainer);
});
