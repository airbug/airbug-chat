//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageListItemContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageListItemView')
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
var ImageListItemView                       = bugpack.require('airbug.ImageListItemView');
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

var ImageListItemContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(imageAssetModel, userAssetModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageAssetModel}
         */
        this.imageAssetModel                        = imageAssetModel;

        /**
         * @private
         * @type {UserAssetModel}
         */
        this.userAssetModel                         = userAssetModel;

        // Models
        //-------------------------------------------------------------------------------


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

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageListItemView}
         */
        this.imageListItemView                      = null;

        // Buttons
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageUploadItemButtonToolbarContainer}
         */
        this.imageUploadItemButtonToolbarContainer  = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.imageListItemView =
            view(ImageListItemView)
                .model(this.imageAssetModel)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imageListItemView);

    },

    createContainerChildren: function() {
        this._super();
        this.imageUploadItemButtonToolbarContainer   = new ImageUploadItemButtonToolbarContainer();

        this.addContainerChild(this.imageUploadItemButtonToolbarContainer, ".image-upload-item")
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.imageUploadItemView.addEventListener(ImageViewEvent.EventType.CLICKED_SEND, this.handleSendImageEvent, this);
        this.imageUploadItemView.addEventListener(ImageViewEvent.EventType.CLICKED_DELETE, this.handleDeleteImageEvent, this);
    },

    deinitializeEventListeners: function() {

    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {

    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {

    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    handleSendImageEvent: function(event) {
        console.log("ImageUploadItemContainer#handleSendImageEvent");
        this.sendImageChatMessage();
    },

    handleDeleteImageEvent: function(event) {
        console.log("ImageUploadItemContainer#handleDeleteImageEvent");
    },

    getUserAssetModel: function() {
        return this.userAssetModel;
    },

    getImageAssetModel: function() {
        return this.imageAssetModel;
    },

    sendImageChatMessage: function() {
        var imageData = this.imageAssetModel.getData();
        var chatMessageObject = {
            type: "image",
            body: {parts: [{
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
        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, chatMessageObject);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageListItemContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("assetManagerModule").ref("assetManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListItemContainer", ImageListItemContainer);
