//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorSettingsWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorSettingsWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('airbug.TabViewEvent')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonGroupView                 = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView               = bugpack.require('airbug.ButtonToolbarView');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorSettingsWidgetView    = bugpack.require('airbug.CodeEditorSettingsWidgetView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var FormViewEvent                   = bugpack.require('airbug.FormViewEvent');
var IconView                        = bugpack.require('airbug.IconView');
var NakedButtonView                 = bugpack.require('airbug.NakedButtonView');
var TabsView                        = bugpack.require('airbug.TabsView');
var TabView                         = bugpack.require('airbug.TabView');
var TabViewEvent                    = bugpack.require('airbug.TabViewEvent');
var TextView                        = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer   = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var WorkspaceWidgetContainer        = bugpack.require('airbug.WorkspaceWidgetContainer');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');
var JQuery                          = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $                               = JQuery;
var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var CommandType                     = CommandModule.CommandType;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @extends {WorkspaceWidgetContainer}
 */
var CodeEditorSettingsWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                          = null;


        // Views
        //-------------------------------------------------------------------------------


        /**
         * @private
         * @type {CodeEditorSettingsWidgetView}
         */
        this.codeEditorSettingsWidgetView           = null;

        /**
         * @private
         * @type {TabView}
         */
        this.editorTabView                          = null;

        /**
         * @private
         * @type {ButtonGroupView}
         */
        this.widgetControlButtonGroupView           = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButtonContainer                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(CodeEditorSettingsWidgetView)
            .name("codeEditorSettingsWidgetView")
            .children([
                view(ButtonToolbarView)
                    .appendTo("#box-header-{{cid}}")
                    .children([
                        view(ButtonGroupView)
                            .name("widgetControlButtonGroupView")
                            .appendTo('#button-toolbar-{{cid}}')
                    ]),
                view(TabsView)
                    .name("tabsView")
                    .appendTo(".box-header")
                    .children([
                        view(TabView)
                            .name("editorTabView")
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.CHEVRON_LEFT
                                    })
                                    .appendTo("a"),
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.CHEVRON_RIGHT
                                    })
                                    .appendTo("a"),
                                view(TextView)
                                    .attributes({
                                        text: "Editor"
                                    })
                                    .appendTo("a")
                            ]),
                        view(TabView)
                            .name("settingsTabView")
                            .attributes({
                                classes: "disabled active"
                            })
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.COG
                                    })
                                    .appendTo('a'),
                                view(TextView)
                                    .attributes({
                                        text: " Settings"
                                    })
                                    .appendTo('a')
                            ])
                    ])

            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorSettingsWidgetView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButtonContainer = new WorkspaceCloseButtonContainer();
        this.addContainerChild(this.closeButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid());
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.deinitializeEventListeners();
        this.deinitializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initializeEventListeners: function() {
        this.editorTabView.addEventListener(TabViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.getViewTop().$el.find("select#code-editor-mode").change(       {context: this}, this.handleModeSelectionEvent);
        this.getViewTop().$el.find("select#code-editor-theme").change(      {context: this}, this.handleThemeSelectionEvent);
        this.getViewTop().$el.find("select#code-editor-tabsize").change(    {context: this}, this.handleTabSizeSelectionEvent);
        this.getViewTop().$el.find("select#code-editor-whitespace").change( {context: this}, this.handleWhitespaceSelectionEvent);
    },

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.editorTabView.removeEventListener(TabViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.getViewTop().$el.find("select#code-editor-mode").off();
        this.getViewTop().$el.find("select#code-editor-theme").off();
        this.getViewTop().$el.find("select#code-editor-tabsize").off();
        this.getViewTop().$el.find("select#code-editor-whitespace").off();
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @type {PublisherMessage} message
     */
    handleSetModeCommand: function(message) {
        var mode    = message.getData().mode;
        $("select#code-editor-mode option[selected]").removeAttr("selected");
        $("select#code-editor-mode option[value='" + mode + "']").attr("selected", "selected");
    },

    /**
     * @private
     */
    handleBackButtonClickedEvent: function() {
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
    },

    /**
     * @private
     */
    handleModeSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "mode",
            mode: $("select#code-editor-mode").val()
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    },

    /**
     * @private
     */
    handleThemeSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "theme",
            theme: $("select#code-editor-theme").val()
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    },

    /**
     * @private
     */
    handleFontSizeSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "fontSize",
            fontSize: $("select#code-editor-fontsize").val()
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    },

    /**
     * @private
     */
    handleTabSizeSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "tabSize",
            tabSize: $("select#code-editor-tabsize").val()
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    },

    handleWhitespaceSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "whitespace",
            whitespace: $("select#code-editor-whitespace").val()
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorSettingsWidgetContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorSettingsWidgetContainer", CodeEditorSettingsWidgetContainer);
