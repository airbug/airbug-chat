//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorSettingsContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorSettingsView')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonGroupView                 = bugpack.require('airbug.ButtonGroupView');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorSettingsView          = bugpack.require('airbug.CodeEditorSettingsView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var FormViewEvent                   = bugpack.require('airbug.FormViewEvent');
var NakedButtonView                 = bugpack.require('airbug.NakedButtonView');
var TextView                        = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer   = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');
var JQuery                          = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $           = JQuery;
var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var CommandType = CommandModule.CommandType;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorSettingsContainer = Class.extend(CarapaceContainer, {

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
         * @type {CodeEditorSettingsView}
         */
        this.codeEditorSettingsView             = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButtonContainer               = null;

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

        this.codeEditorSettingsView =
            view(CodeEditorSettingsView)
                .id("code-editor-settings")
                .children([
                    view(ButtonToolbarView)
                        .id("code-editor-settings-toolbar")
                        .appendTo(".box-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#code-editor-settings-toolbar')
                                .children([
                                    view(NakedButtonView)
                                        .attributes({
                                            size: NakedButtonView.Size.NORMAL,
                                            disabled: true,
                                            type: NakedButtonView.Type.INVERSE
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.COG,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: " Settings"
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo('#code-editor-settings-toolbar')
                                .children([
                                    view(NakedButtonView)
                                        .id("back-to-code-editor-button")
                                        .attributes({
                                            size: NakedButtonView.Size.SMALL
                                        })
                                        .children([
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_LEFT
                                                })
                                                .appendTo("#back-to-code-editor-button"),
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_RIGHT
                                                })
                                                .appendTo("#back-to-code-editor-button"),
                                            view(TextView)
                                                .attributes({
                                                    text: "Editor"
                                                })
                                                .appendTo("#back-to-code-editor-button")
                                        ])
                                ])
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorSettingsView);

        this.backButtonView = this.findViewById("back-to-code-editor-button");
    },

    createContainerChildren: function() {
        this._super();
        this.closeButtonContainer = new WorkspaceCloseButtonContainer();
        this.addContainerChild(this.closeButtonContainer, "#code-editor-settings-toolbar .btn-group:last-child");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
    },

    deinitializeConatainer: function() {
        this._super();
        this.deinitializeEventListeners();
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    initializeEventListeners: function() {
        this.backButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.getViewTop().$el.find("select#code-editor-mode").change(       {context: this}, this.handleModeSelectionEvent);
        this.getViewTop().$el.find("select#code-editor-theme").change(      {context: this}, this.handleThemeSelectionEvent);
//        this.getViewTop().$el.find("select#code-editor-fontsize").change(   {context: this}, this.handleFontSizeSelectionEvent);
        this.getViewTop().$el.find("select#code-editor-tabsize").change(    {context: this}, this.handleTabSizeSelectionEvent);
//        this.getViewTop().$el.find("select#code-editor-tabtype").change(    {context: this}, this.handleTabTypeSelectionEvent);
    },

    deinitializeEventListeners: function() {
        this.backButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED,  this.handleBackButtonClickedEvent,  this);
        this.getViewTop().$el.find("select#code-editor-mode").off();
        this.getViewTop().$el.find("select#code-editor-theme").off();
//        this.getViewTop().$el.find("select#code-editor-fontsize").off();
        this.getViewTop().$el.find("select#code-editor-tabsize").off();
//        this.getViewTop().$el.find("select#code-editor-tabtype").off();
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    handleBackButtonClickedEvent: function() {
        this.commandModule.relayCommand(CommandType.TOGGLE.CODE_EDITOR_SETTINGS, {});
    },

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

    handleTabTypeSelectionEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var context = event.data.context;
        var data = {
            setting: "tabType",
            tabType: $("select#code-editor-tabtype").val().match(/\-(.*)/)[1]
        };
        context.getViewTop().dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorSettingsContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorSettingsContainer", CodeEditorSettingsContainer);
