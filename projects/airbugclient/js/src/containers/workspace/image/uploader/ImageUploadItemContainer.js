//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageUploadItemContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageUploadItemView')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.ImageUploadItemButtonToolbarContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')
//@Require('fileupload.FileUpload')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var CommandModule                           = bugpack.require('airbug.CommandModule');
var ImageUploadItemButtonToolbarContainer   = bugpack.require('airbug.ImageUploadItemButtonToolbarContainer');
var ImageUploadItemView                     = bugpack.require('airbug.ImageUploadItemView');
var ImageViewEvent                          = bugpack.require('airbug.ImageViewEvent');
var AutowiredAnnotation                     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');
var jQuery                                  = bugpack.require('jquery.JQuery');


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

var ImageUploadItemContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(imageAssetModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
         * @type {ImageUploadItemView}
         */
        this.imageUploadItemView                    = null;

        // Buttons
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageUploadItemButtonToolbarContainer}
         */
        this.imageUploadItemButtonToolbarContainer  = null;
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
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.imageUploadItemView =
            view(ImageUploadItemView)
                .model(this.imageAssetModel)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imageUploadItemView);

    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.imageUploadItemButtonToolbarContainer   = new ImageUploadItemButtonToolbarContainer();
        this.addContainerChild(this.imageUploadItemButtonToolbarContainer, ".image-upload-item");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.imageUploadItemView.removeEventListener(ImageViewEvent.EventType.CLICKED_SEND, this.hearClickedSend, this);
        this.imageUploadItemView.removeEventListener(ImageViewEvent.EventType.CLICKED_EMBED, this.hearClickedEmbed, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.imageUploadItemView.addEventListener(ImageViewEvent.EventType.CLICKED_SEND, this.hearClickedSend, this);
        this.imageUploadItemView.addEventListener(ImageViewEvent.EventType.CLICKED_EMBED, this.hearClickedEmbed, this);
        this.hideToolbarContainer();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    hideToolbarContainer: function() {
        this.imageUploadItemButtonToolbarContainer.getViewTop().hide();
    },

    /**
     *
     */
    showToolbarContainer: function() {
        this.imageUploadItemButtonToolbarContainer.getViewTop().show();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

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
    hearClickedEmbed: function(event) {
        this.embedImageMessagePart();
    },

    /**
     *
     */
    hearClickedSend: function(event) {
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
