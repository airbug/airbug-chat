//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserImageAssetContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageListItemView')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.ImageListItemButtonToolbarContainer')
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
var ImageListItemButtonToolbarContainer     = bugpack.require('airbug.ImageListItemButtonToolbarContainer');
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

var UserImageAssetContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(userImageAssetModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
         * @type {UserAssetManagerModule}
         */
        this.userAssetManagerModule                 = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageListItemView}
         */
        this.imageListItemView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageListItemButtonToolbarContainer}
         */
        this.imageListItemButtonToolbarContainer    = null;
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
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.imageListItemView =
            view(ImageListItemView)
                .model(this.userImageAssetModel)
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.imageListItemView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.imageListItemButtonToolbarContainer   = new ImageListItemButtonToolbarContainer();
        this.addContainerChild(this.imageListItemButtonToolbarContainer, "#image-list-item-{{cid}}");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeEventListeners: function() {
        this.imageListItemView.removeEventListener(ImageViewEvent.EventType.CLICKED_SEND, this.handleSendImageEvent, this);
        this.imageListItemView.removeEventListener(ImageViewEvent.EventType.CLICKED_DELETE, this.handleDeleteImageEvent, this);
    },

    /**
     * @protected
     */
    initializeEventListeners: function() {
        this.imageListItemView.addEventListener(ImageViewEvent.EventType.CLICKED_SEND, this.handleSendImageEvent, this);
        this.imageListItemView.addEventListener(ImageViewEvent.EventType.CLICKED_DELETE, this.handleDeleteImageEvent, this);
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
    sendImageChatMessage: function() {
        var imageData = this.userImageAssetModel.getData();
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
    },


    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleSendImageEvent: function(event) {
        this.sendImageChatMessage();
    },

    /**
     * @private
     * @param {Event} event
     */
    handleDeleteImageEvent: function(event) {
        this.deleteUserAsset();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserImageAssetContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("logger").ref("logger"),
        property("userAssetManagerModule").ref("userAssetManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserImageAssetContainer", UserImageAssetContainer);