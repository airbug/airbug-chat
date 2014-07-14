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

//@Export('airbug.ImageUploadItemContainer')

//@Require('Class')
//@Require('StateEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageUploadItemView')
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
//@Require('fileupload.FileUpload')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var StateEvent              = bugpack.require('StateEvent');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var ImageUploadItemView     = bugpack.require('airbug.ImageUploadItemView');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ButtonGroupView         = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView       = bugpack.require('carapace.ButtonToolbarView');
    var ButtonViewEvent         = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var IconView                = bugpack.require('carapace.IconView');
    var NakedButtonView         = bugpack.require('carapace.NakedButtonView');
    var TextView                = bugpack.require('carapace.TextView');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');
    var jQuery                  = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $                       = jQuery;
    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ImageUploadItemContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ImageUploadItemContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ImageAssetModel} imageAssetModel
         */
        _constructor: function(imageAssetModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ImageAssetModel}
             */
            this.imageAssetModel                        = imageAssetModel;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AssetManagerModule}
             */
            this.assetManagerModule                     = null;

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
            this.embedButtonView                       = null;

            /**
             * @private
             * @type {ImageUploadItemView}
             */
            this.imageUploadItemView                    = null;

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
         * @return {ImageAssetModel}
         */
        getImageAssetModel: function() {
            return this.imageAssetModel;
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

            view(ImageUploadItemView)
                .name("imageUploadItemView")
                .model(this.imageAssetModel)
                .children([
                    view(ButtonToolbarView)
                        .name("buttonToolbarView")
                        .appendTo("#image-upload-item-{{cid}}")
                        .children([
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


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.imageUploadItemView);
            this.addModel(this.imageAssetModel);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClicked, this);
            this.embedButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClicked, this);
            this.messageHandlerModule.removeEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClicked, this);
            this.embedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClicked, this);
            this.messageHandlerModule.addEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
            this.hideToolbarContainer();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        hideToolbarContainer: function() {
            this.buttonToolbarView.hide();
        },

        /**
         *
         */
        showToolbarContainer: function() {
            this.buttonToolbarView.show();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        embedImageMessagePart: function() {
            var imageData           = this.imageAssetModel.getData();
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
            var imageData           = this.imageAssetModel.getData();
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

    bugmeta.tag(ImageUploadItemContainer).with(
        autowired().properties([
            property("assetManagerModule").ref("assetManagerModule"),
            property("commandModule").ref("commandModule"),
            property("messageHandlerModule").ref("messageHandlerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadItemContainer", ImageUploadItemContainer);
});
