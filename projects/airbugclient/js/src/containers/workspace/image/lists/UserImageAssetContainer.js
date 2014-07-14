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

//@Export('airbug.UserImageAssetContainer')

//@Require('Class')
//@Require('StateEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageListItemView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ButtonGroupView')
//@Require('carapace.ButtonToolbarView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.IconView')
//@Require('carapace.NakedButtonView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var StateEvent          = bugpack.require('StateEvent');
    var CommandModule       = bugpack.require('airbug.CommandModule');
    var ImageListItemView   = bugpack.require('airbug.ImageListItemView');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var ButtonGroupView     = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView   = bugpack.require('carapace.ButtonToolbarView');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer   = bugpack.require('carapace.CarapaceContainer');
    var IconView            = bugpack.require('carapace.IconView');
    var NakedButtonView     = bugpack.require('carapace.NakedButtonView');
    var TextView            = bugpack.require('carapace.TextView');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');
    var jQuery              = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $                   = jQuery;
    var autowired           = AutowiredTag.autowired;
    var bugmeta             = BugMeta.context();
    var CommandType         = CommandModule.CommandType;
    var property            = PropertyTag.property;
    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var UserImageAssetContainer = Class.extend(CarapaceContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {UserImageAssetModel} userImageAssetModel
         */
        _constructor: function(userImageAssetModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Logger}
             */
            this.logger                                 = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {UserImageAssetModel}
             */
            this.userImageAssetModel                    = userImageAssetModel;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule                   = null;

            /**
             * @private
             * @type {UserAssetManagerModule}
             */
            this.userAssetManagerModule                 = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonToolbarView}
             */
            this.buttonToolbarView                      = null;

            /**
             * @private
             * @type {NakedButtonView}
             */
            this.deleteButtonView                       = null;

            /**
             * @private
             * @type {NakedButtonView}
             */
            this.embedButtonView                       = null;
            
            /**
             * @private
             * @type {ImageListItemView}
             */
            this.imageListItemView                      = null;

            /**
             * @private
             * @type {NakedButtonView}
             */
            this.sendButtonView                         = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {UserImageAssetModel}
         */
        getUserImageAssetModel: function() {
            return this.userImageAssetModel;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            this.processMessageHandlerState();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Views
            //-------------------------------------------------------------------------------

            view(ImageListItemView)
                .name("imageListItemView")
                .model(this.userImageAssetModel)
                .children([
                    view(ButtonToolbarView)
                        .name("buttonToolbarView")
                        .appendTo("#image-list-item-{{cid}}")
                        .children([
                            view(ButtonGroupView)
                                .appendTo("#button-toolbar-{{cid}}")
                                .children([
                                    view(NakedButtonView)
                                        .name("deleteButtonView")
                                        .appendTo("#button-group-{{cid}}")
                                        .attributes({
                                            type: NakedButtonView.Type.DANGER
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.TRASH,
                                                    color: IconView.Color.WHITE
                                                })
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo("#button-toolbar-{{cid}}")
                                .children([
                                    view(NakedButtonView)
                                        .name("embedButtonView")
                                        .appendTo("#button-group-{{cid}}")
                                        .attributes({
                                            type: NakedButtonView.Type.DEFAULT
                                        })
                                        .children([
                                            view(TextView)
                                                .attributes({
                                                    text: "Embed",
                                                    disabled: true
                                                })
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo("#button-toolbar-{{cid}}")
                                .children([
                                    view(NakedButtonView)
                                        .name("sendButtonView")
                                        .appendTo("#button-group-{{cid}}")
                                        .attributes({
                                            type: NakedButtonView.Type.DEFAULT
                                        })
                                        .children([
                                            view(TextView)
                                                .attributes({
                                                    text: "Send",
                                                    disabled: true
                                                })
                                        ])
                                ])
                        ])
                ])
                .build(this);


            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.imageListItemView);
            this.addModel(this.userImageAssetModel);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClicked, this);
            this.embedButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClicked, this);
            this.deleteButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearDeleteButtonClicked, this);
            this.messageHandlerModule.removeEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClicked, this);
            this.embedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClicked, this);
            this.deleteButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearDeleteButtonClicked, this);
            this.messageHandlerModule.addEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        deleteUserAsset: function() {
            var _this = this;
            this.userAssetManagerModule.deleteUserAsset(this.userImageAssetModel.getProperty("id"), function(throwable){
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });

            //NOTE BRN: We hide automatically and let the background processing do the actual removal and cleanup

            this.getViewTop().hide();
        },

        /**
         * @private
         */
        embedImageMessagePart: function() {
            var imageData           = this.userImageAssetModel.getData();
            var imageMessagePart    = {
                assetId: imageData.assetId,
                type: "image",
                url: imageData.url,
                size: imageData.size,
                midsizeMimeType: imageData.midsizeMimeType,
                midsizeUrl: imageData.midsizeUrl,
                mimeType: imageData.mimeType,
                thumbnailMimeType: imageData.thumbnailMimeType,
                thumbnailUrl: imageData.thumbnailUrl
            };
            this.messageHandlerModule.embedMessagePart(imageMessagePart);
        },

        /**
         * @private
         */
        processMessageHandlerState: function() {
            if (this.messageHandlerModule.doesSupportEmbed()) {
                this.embedButtonView.enableButton();
            } else {
                this.embedButtonView.disableButton();
            }
            if (this.messageHandlerModule.doesSupportSend()) {
                this.sendButtonView.enableButton();
            } else {
                this.sendButtonView.disableButton();
            }
        },

        /**
         * @private
         */
        sendImageChatMessage: function() {
            var imageData           = this.userImageAssetModel.getData();
            var chatMessageObject   = {
                type: "image",
                body: {parts: [{
                    assetId: imageData.assetId,
                    type: "image",
                    url: imageData.url,
                    size: imageData.size,
                    midsizeMimeType: imageData.midsizeMimeType,
                    midsizeUrl: imageData.midsizeUrl,
                    mimeType: imageData.mimeType,
                    thumbnailMimeType: imageData.thumbnailMimeType,
                    thumbnailUrl: imageData.thumbnailUrl
                }]}
            };
            this.messageHandlerModule.sendMessage(chatMessageObject);
        },


        //-------------------------------------------------------------------------------
        // Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearDeleteButtonClicked: function(event) {
            this.deleteUserAsset();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearEmbedButtonClicked: function(event) {
            this.embedImageMessagePart();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearMessageHandlerModuleStateChanged: function(event) {
            this.processMessageHandlerState();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearSendButtonClicked: function(event) {
            this.sendImageChatMessage();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserImageAssetContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("logger").ref("logger"),
            property("messageHandlerModule").ref("messageHandlerModule"),
            property("userAssetManagerModule").ref("userAssetManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserImageAssetContainer", UserImageAssetContainer);
});
