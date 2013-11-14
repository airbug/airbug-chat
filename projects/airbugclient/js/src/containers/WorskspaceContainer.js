//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceContainer')

//@Require('Class')
//@Require('airbug.CodeEditorWidgetContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.PanelView')
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

var Class                       = bugpack.require('Class');
var CodeEditorWidgetContainer   = bugpack.require('airbug.CodeEditorWidgetContainer');
var CommandModule               = bugpack.require('airbug.CommandModule');
var PanelView                   = bugpack.require('airbug.PanelView');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


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
         * @type {airbug.CommandModule}
         */
        this.commandModule                  = null;


        // Views
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {airbug.PanelView}
         */
        this.panelView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.CodeEditorWidgetContainer}
         */
        this.codeEditorWidgetContainer      = null;

        /**
         * @private
         * @type {airbug.PictureEditorWidgetContainer}
         */
        this.pictureEditorWidgetContainer   = null;

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

        this.panelView =
            view(PanelView)
                .id("workspace-container")
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    createContainerChildren: function() {
        this._super();
        this.codeEditorWidgetContainer      = new CodeEditorWidgetContainer();
        this.addContainerChild(this.codeEditorWidgetContainer, "#panel-body-" + this.panelView.cid);
        //TODO
        // this.pictureEditorWidgetContainer   = new PictureEditorWidgetContainer();
        // this.addContainerChild(this.pictureEditorWidgetContainer, "#panel-body-" + this.panelView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeCommandSubscriptions: function(){
        this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
        // this.commandModule.subscribe(CommandType.DISPLAY.PICTURE_EDITOR, this.handleDisplayPictureEditorCommand, this);

    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {PublisherMessage} message
     */
    handleDisplayCodeEditorCommand: function(message){
        // var topic               = message.getTopic();
        // var data                = message.getMessage();

        this.handleDisplayCommand("#code-editor-widget");
    },

    /**
     * @param {PublisherMessage} message
     */
    handleDisplayPictureEditorCommand: function(message){
        // var topic               = message.getTopic();
        // var data                = message.getMessage();

        this.handleDisplayCommand("#picture-editor-widget");
    },

    /**
     * @param {string} widgetId //in CSS format
     */
    handleDisplayCommand: function(widgetId){
        var workspaceWidgets    = this.viewTop.$el.find(".workspace-widget");
        var codeEditorWidget    = this.viewTop.$el.find("#code-editor-widget");

        codeEditorWidget.show();
        workspaceWidgets.not(widgetId).hide();
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
