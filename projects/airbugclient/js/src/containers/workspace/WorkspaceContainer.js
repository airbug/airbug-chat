//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceContainer')

//@Require('Class')
//@Require('airbug.CodeEditorWorkspaceContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorWidgetContainer')
//@Require('airbug.PanelView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var CodeEditorWorkspaceContainer    = bugpack.require('airbug.CodeEditorWorkspaceContainer');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var ImageEditorWidgetContainer      = bugpack.require('airbug.ImageEditorWidgetContainer');
var PanelView                       = bugpack.require('airbug.PanelView');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var CommandType                 = CommandModule.CommandType;
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceContainer = Class.extend(CarapaceContainer, {

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

        /**
         * @type {CommandModule}
         */
        this.commandModule                  = null;


        // Views
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {PanelView}
         */
        this.panelView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorWorkspaceContainer}
         */
        this.codeEditorWorkspaceContainer      = null;

        /**
         * @private
         * @type {ImageEditorWidgetContainer}
         */
        this.imageEditorWidgetContainer   = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
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

        this.panelView =
            view(PanelView)
                .id("workspace-container")
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.codeEditorWorkspaceContainer   = new CodeEditorWorkspaceContainer();
        this.imageEditorWidgetContainer     = new ImageEditorWidgetContainer();
        this.addContainerChild(this.codeEditorWorkspaceContainer, "#panel-body-" + this.panelView.cid);
        this.addContainerChild(this.imageEditorWidgetContainer, "#panel-body-" + this.panelView.cid);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeCommandSubscriptions();
    },
    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
        this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
        this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_EDITOR, this.handleDisplayImageEditorCommand, this);
    },


    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {PublisherMessage} message
     */
    handleDisplayCodeEditorCommand: function(message) {
        this.handleDisplayCommand("#code-editor-workspace");
    },

    /**
     * @param {PublisherMessage} message
     */
    handleDisplayImageEditorCommand: function(message) {
        this.handleDisplayCommand("#image-editor-widget");
    },

    /**
     * @param {string} widgetId //in CSS format
     */
    handleDisplayCommand: function(widgetId) {
        var widget              = this.viewTop.$el.find(widgetId);
        var workspaceWidgets    = this.viewTop.$el.find(".workspace-widget");

        workspaceWidgets.not(widgetId).removeClass("workspace-widget-open").hide();
        widget.addClass("workspace-widget-open").show();
    }

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(WorkspaceContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceContainer", WorkspaceContainer);
