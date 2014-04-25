//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageUploadItemContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageUploadItemView')
//@Require('airbug.MessageHandlerModule')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')
//@Require('fileupload.FileUpload')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
    var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var IconView                            = bugpack.require('airbug.IconView');
    var ImageUploadItemView                 = bugpack.require('airbug.ImageUploadItemView');
    var MessageHandlerModule                = bugpack.require('airbug.MessageHandlerModule');
    var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
    var TextView                            = bugpack.require('airbug.TextView');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');
    var jQuery                              = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $                                   = jQuery;
    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;


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
            this.messageHandlerModule.removeEventListener(MessageHandlerModule.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClicked, this);
            this.embedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClicked, this);
            this.messageHandlerModule.addEventListener(MessageHandlerModule.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
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
            var handlerState = this.messageHandlerModule.getHandlerState();
            if (handlerState === MessageHandlerModule.HandlerState.EMBED_AND_SEND || handlerState === MessageHandlerModule.HandlerState.EMBED_ONLY) {
                this.embedButtonView.enableButton();
            } else {
                this.embedButtonView.disableButton();
            }
            if (handlerState === MessageHandlerModule.HandlerState.EMBED_AND_SEND || handlerState === MessageHandlerModule.HandlerState.SEND_ONLY) {
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

    bugmeta.annotate(ImageUploadItemContainer).with(
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