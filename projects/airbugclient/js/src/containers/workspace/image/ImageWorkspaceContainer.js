//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageWorkspaceContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorWidgetContainer')
//@Require('airbug.ImageListWidgetContainer')
//@Require('airbug.ImageUploadWidgetContainer')
//@Require('airbug.ImageWorkspace')
//@Require('airbug.WorkspaceContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var BoxView                             = bugpack.require('airbug.BoxView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var ImageEditorWidgetContainer          = bugpack.require('airbug.ImageEditorWidgetContainer');
    var ImageListWidgetContainer            = bugpack.require('airbug.ImageListWidgetContainer');
    var ImageUploadWidgetContainer          = bugpack.require('airbug.ImageUploadWidgetContainer');
    var ImageWorkspace                      = bugpack.require('airbug.ImageWorkspace');
    var WorkspaceContainer                  = bugpack.require('airbug.WorkspaceContainer');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {WorkspaceContainer}
     */
    var ImageWorkspaceContainer = Class.extend(WorkspaceContainer, {

        _name: "airbug.ImageWorkspaceContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super(ImageWorkspace.WORKSPACE_NAME);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                  = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ImageEditorWidgetContainer}
             */
            this.imageEditorWidgetContainer     = null;

            /**
             * @private
             * @type {ImageListWidgetContainer}
             */
            this.imageListWidgetContainer       = null;

            /**
             * @private
             * @type {ImageUploadWidgetContainer}
             */
            this.imageUploadWidgetContainer     = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.imageEditorWidgetContainer     = new ImageEditorWidgetContainer();
            this.imageListWidgetContainer       = new ImageListWidgetContainer();
            this.imageUploadWidgetContainer     = new ImageUploadWidgetContainer();
            this.addContainerChild(this.imageEditorWidgetContainer, "#workspace-" + this.getWorkspaceView().getCid());
            this.addContainerChild(this.imageListWidgetContainer, "#workspace-" + this.getWorkspaceView().getCid());
            this.addContainerChild(this.imageUploadWidgetContainer, "#workspace-" + this.getWorkspaceView().getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();

            this.deregisterWidget(ImageWorkspace.WidgetNames.EDITOR);
            this.deregisterWidget(ImageWorkspace.WidgetNames.LIST);
            this.deregisterWidget(ImageWorkspace.WidgetNames.UPLOAD);

            this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
            this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_LIST, this.handleDisplayImageListCommand, this);
            this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
            this.commandModule.unsubscribe(CommandType.SAVE.TO_IMAGE_LIST, this.handleSaveToImageListCommand, this);
            this.commandModule.unsubscribe(CommandType.TOGGLE.IMAGE_LIST, this.handleToggleImageListCommand, this);
            this.commandModule.unsubscribe(CommandType.TOGGLE.IMAGE_WORKSPACE, this.handleToggleImageWorkspaceCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();

            if (!this.getCurrentWidgetName()) {
                this.setCurrentWidgetName(ImageWorkspace.WidgetNames.LIST);
            }

            this.registerWidget(ImageWorkspace.WidgetNames.EDITOR, this.imageEditorWidgetContainer);
            this.registerWidget(ImageWorkspace.WidgetNames.LIST, this.imageListWidgetContainer);
            this.registerWidget(ImageWorkspace.WidgetNames.UPLOAD, this.imageUploadWidgetContainer);

            this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
            this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_LIST, this.handleDisplayImageListCommand, this);
            this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
            this.commandModule.subscribe(CommandType.SAVE.TO_IMAGE_LIST, this.handleSaveToImageListCommand, this);
            this.commandModule.subscribe(CommandType.TOGGLE.IMAGE_LIST, this.handleToggleImageListCommand, this);
            this.commandModule.subscribe(CommandType.TOGGLE.IMAGE_WORKSPACE, this.handleToggleImageWorkspaceCommand, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        openImageEditor: function() {
            this.openWidget(ImageWorkspace.WidgetNames.EDITOR);
        },

        /**
         * @private
         */
        openImageList: function() {
            this.openWidget(ImageWorkspace.WidgetNames.LIST);
        },

        /**
         * @private
         */
        openImageUpload: function() {
            this.openWidget(ImageWorkspace.WidgetNames.UPLOAD);
        },

        /**
         * @private
         */
        toggleImageEditor: function() {
            this.toggleWidget(ImageWorkspace.WidgetNames.EDITOR);
        },

        /**
         * @private
         */
        toggleImageList: function() {
            this.toggleWidget(ImageWorkspace.WidgetNames.LIST);
        },

        /**
         * @private
         */
        toggleImageUpload: function() {
            this.toggleWidget(ImageWorkspace.WidgetNames.UPLOAD);
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Message} message
         */
        handleDisplayImageEditorCommand: function(message) {
            this.openImageEditor()
        },

        /**
         * @private
         * @param {Message} message
         */
        handleDisplayImageListCommand: function(message) {
            this.openImageList();
        },

        /**
         * @private
         * @param {Message} message
         */
        handleDisplayImageUploadCommand: function(message) {
            this.openImageUpload();
        },

        /**
         * @private
         * @param {Message} message
         */
        handleSaveToImageListCommand: function(message) {
            var _this   = this;
            var data    = message.getData();
            var assetId = data.assetId;

            this.imageUploadWidgetContainer.createUserAsset(assetId, function(throwable, userAssetId) {
                if (!throwable) {
                    _this.openImageList();

                    //show image list scroll to top
                } else {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: throwable.getMessage()});
                }
            });
        },

        /**
         * @private
         * @param {Message} message
         */
        handleToggleImageListCommand: function(message) {
            this.toggleImageList();
        },

        /**
         * @private
         * @param {Message} message
         */
        handleToggleImageWorkspaceCommand: function(message) {
            this.toggleWorkspace();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ImageWorkspaceContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageWorkspaceContainer", ImageWorkspaceContainer);
});
