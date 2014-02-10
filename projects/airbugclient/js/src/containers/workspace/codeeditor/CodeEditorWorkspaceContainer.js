//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWorkspaceContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CodeEditorWidgetContainer')
//@Require('airbug.CodeEditorSettingsContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
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
var CodeEditorWidgetContainer           = bugpack.require('airbug.CodeEditorWidgetContainer');
var CodeEditorSettingsContainer         = bugpack.require('airbug.CodeEditorSettingsContainer');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var FormViewEvent                       = bugpack.require('airbug.FormViewEvent');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var CommandType = CommandModule.CommandType;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorWorkspaceContainer = Class.extend(CarapaceContainer, {

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
         * @private
         * @type {CommandModule}
         */
        this.commandModule                      = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxView}
         */
        this.boxView                            = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorWidgetContainer}
         */
        this.codeEditorWidgetContainer          = null;

        /**
         * @private
         * @type {CodeEditorSettingsContainer}
         */
        this.codeEditorSettingsContainer        = null;

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
                .id("code-editor-workspace")
                .attributes({classes: "workspace-widget"})
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },

    createContainerChildren: function() {
        this._super();
        this.codeEditorWidgetContainer          = new CodeEditorWidgetContainer();
        this.codeEditorSettingsContainer        = new CodeEditorSettingsContainer();
        this.addContainerChild(this.codeEditorWidgetContainer,      "#code-editor-workspace");
        this.addContainerChild(this.codeEditorSettingsContainer,    "#code-editor-workspace");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
        this.viewTop.$el.find("#code-editor-settings-wrapper").hide();
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

    /**
     * @private
     */
    initializeEventListeners: function() {
        this.codeEditorSettingsContainer.getViewTop().addEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);
    },

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.codeEditorSettingsContainer.getViewTop().removeEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, this.handleToggleCodeEditorSettingsCommand, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, this.handleToggleCodeEditorSettingsCommand, this);
    },

    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {PublisherMessage} message
     */
    handleToggleCodeEditorSettingsCommand: function(message) {
        console.log("viewTop:", this.getViewTop());

        if(this.getViewTop()) {
            var codeEditorWidget = this.getViewTop().$el.find("#code-editor-widget");
            var codeEditorSettings  = this.getViewTop().$el.find("#code-editor-settings-wrapper");

            if (codeEditorWidget.is(":hidden")) {
                codeEditorWidget.show();
                codeEditorSettings.hide();
            } else {
                codeEditorSettings.show();
                codeEditorWidget.hide();
            }
        }
    },

    handleSettingsChangeEvent: function(event) {
        var data = event.getData();
        var setting = data.setting;

        switch(setting) {
            case "mode":
                var mode        = data.mode;
                this.codeEditorWidgetContainer.setEditorMode(mode);
                break;
            case "theme":
                var theme       = data.theme;
                this.codeEditorWidgetContainer.setEditorTheme(theme);
                break;
            case "fontSize":
                var fontSize    = data.fontSize;
                this.codeEditorWidgetContainer.setEditorFontSize(fontSize);
                break;
            case "tabSize":
                var tabSize     = data.tabSize;
                this.codeEditorWidgetContainer.setEditorTabSize(tabSize);
                break;
            case "tabType":
                var tabType     = data.tabType;
                this.codeEditorWidgetContainer.setEditorTabType(tabType);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorWorkspaceContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWorkspaceContainer", CodeEditorWorkspaceContainer);
