//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorContainer')
//@Require('airbug.ImageListContainer')
//@Require('airbug.ImageUploadContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var BoxView                             = bugpack.require('airbug.BoxView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var ImageEditorContainer                = bugpack.require('airbug.ImageEditorContainer');
var ImageListContainer                  = bugpack.require('airbug.ImageListContainer');
var ImageUploadContainer                = bugpack.require('airbug.ImageUploadContainer');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType = CommandModule.CommandType;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageEditorWidgetContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxView}
         */
        this.boxView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ImageEditorContainer}
         */
        this.imageEditorContainer            = null;

        /**
         * @private
         * @type {ImageListContainer}
         */
        this.imageListContainer    = null;

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

        this.boxView =
            view(BoxView)
                .id("image-editor-widget")
                .attributes({classes: "workspace-widget"})
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },

    createContainerChildren: function() {
        this._super();
//        this.imageEditorContainer   = new ImageEditorContainer();
        this.imageListContainer     = new ImageListContainer();
        this.imageUploadContainer   = new ImageUploadContainer();
//        this.addContainerChild(this.imageEditorContainer,       "#image-editor-widget");
        this.addContainerChild(this.imageListContainer,         "#image-editor-widget");
        this.addContainerChild(this.imageUploadContainer, "#image-editor-widget");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeCommandSubscriptions();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_UPLOAD, this.handleDisplayImageUploadCommand, this);
    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    handleDisplayImageUploadCommand: function() {
        var imageEditor = this.viewTop.$el.find("#image-editor-container");
        var imageList   = this.viewTop.$el.find("#image-list-container");
        var imageUpload = this.viewTop.$el.find("#image-upload-container");

        imageEditor.hide();
        imageList.hide();
        imageUpload.show();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ImageEditorWidgetContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageEditorWidgetContainer", ImageEditorWidgetContainer);
