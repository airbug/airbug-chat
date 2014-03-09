//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageWorkspaceContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorWidgetContainer')
//@Require('airbug.ImageListWidgetContainer')
//@Require('airbug.ImageUploadWidgetContainer')
//@Require('airbug.ImageWorkspace')
//@Require('airbug.WorkspaceContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


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
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageWorkspaceContainer = Class.extend(WorkspaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

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
        this.addContainerChild(this.imageEditorWidgetContainer, "#box-" + this.getBoxView().getCid());
        this.addContainerChild(this.imageListWidgetContainer, "#box-" + this.getBoxView().getCid());
        this.addContainerChild(this.imageUploadWidgetContainer, "#box-" + this.getBoxView().getCid());
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.getWorkspaceModule().deregisterWorkspace(ImageWorkspace.WORKSPACE_NAME);
        this.deinitializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.imageEditorWidgetContainer.hideWidget();
        this.imageListWidgetContainer.hideWidget();
        this.imageUploadWidgetContainer.hideWidget();
        this.getWorkspaceModule().registerWorkspace(ImageWorkspace.WORKSPACE_NAME, this);
        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
        this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_LIST, this.handleDisplayImageListCommand, this);
        this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
        this.commandModule.subscribe(CommandType.TOGGLE.IMAGE_LIST, this.handleToggleImageListCommand, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
        this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_LIST, this.handleDisplayImageListCommand, this);
        this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
        this.commandModule.unsubscribe(CommandType.TOGGLE.IMAGE_LIST, this.handleToggleImageListCommand, this);
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Message} message
     */
    handleDisplayImageEditorCommand: function(message) {
        this.showWidget(this.imageEditorWidgetContainer, ImageWorkspace.WORKSPACE_NAME);
    },

    /**
     * @private
     * @param {Message} message
     */
    handleDisplayImageListCommand: function(message) {
        this.showWidget(this.imageListWidgetContainer, ImageWorkspace.WORKSPACE_NAME);
    },

    /**
     * @private
     * @param {Message} message
     */
    handleDisplayImageUploadCommand: function(message) {
        this.showWidget(this.imageUploadWidgetContainer, ImageWorkspace.WORKSPACE_NAME);
    },

    /**
     * @private
     * @param {Message} message
     */
    handleToggleImageListCommand: function(message) {
        this.imageUploadWidgetContainer.hideWidget();
        this.toggleWidget(this.imageListWidgetContainer, ImageWorkspace.WORKSPACE_NAME);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageWorkspaceContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageWorkspaceContainer", ImageWorkspaceContainer);
