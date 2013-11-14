//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.CodeEditorContainer')
//@Require('airbug.CodeEditorSettingsContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.PanelView')
//@Require('airbug.TwoColumnView')
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
var CodeEditorContainer                 = bugpack.require('airbug.CodeEditorContainer');
var CodeEditorSettingsContainer         = bugpack.require('airbug.CodeEditorSettingsContainer');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var PanelView                           = bugpack.require('airbug.PanelView');
var TwoColumnView                       = bugpack.require('airbug.TwoColumnView');
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

var CodeEditorWidgetContainer = Class.extend(CarapaceContainer, {

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
         * @type {airbug.PanelView}
         */
        this.panelView                      = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.CodeEditorContainer}
         */
        this.codeEditorContainer            = null;

        /**
         * @private
         * @type {airbug.CodeEditorSettingsContainer}
         */
        this.codeEditorSettingsContainer    = null;

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
                .id("code-editor-widget")
                .attributes({classes: "workspace-widget"})
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    createContainerChildren: function() {
        this._super();
        this.codeEditorContainer            = new CodeEditorContainer();
        this.codeEditorSettingsContainer    = new CodeEditorSettingsContainer();
        this.addContainerChild(this.codeEditorContainer,            "#code-editor-widget");
        this.addContainerChild(this.codeEditorSettingsContainer,    "#code-editor-widget");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeCommandSubscriptions();
        this.viewTop.$el.find("#code-editor-settings-wrapper").hide();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, this.handleToggleCodeEditorSettingsCommand, this);

    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {PublisherMessage} message
     */
    handleToggleCodeEditorSettingsCommand: function(message){
        var codeEditor          = this.viewTop.$el.find("#code-editor-container");
        var codeEditorSettings  = this.viewTop.$el.find("#code-editor-settings-wrapper");

        if(codeEditor.is(":hidden")){
            codeEditor.show();
            codeEditorSettings.hide();
        } else {
            codeEditorSettings.show();
            codeEditor.hide();
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorWidgetContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
