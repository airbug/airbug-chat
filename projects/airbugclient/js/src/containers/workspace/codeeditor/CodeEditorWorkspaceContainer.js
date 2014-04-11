//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorWorkspaceContainer')

//@Require('Class')
//@Require('airbug.BoxView')
//@Require('airbug.CodeEditorSettingsWidgetContainer')
//@Require('airbug.CodeEditorWidgetContainer')
//@require('airbug.CodeEditorWorkspace')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
//@Require('airbug.WorkspaceContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
    var CodeEditorSettingsWidgetContainer   = bugpack.require('airbug.CodeEditorSettingsWidgetContainer');
    var CodeEditorWidgetContainer           = bugpack.require('airbug.CodeEditorWidgetContainer');
    var CodeEditorWorkspace                 = bugpack.require('airbug.CodeEditorWorkspace');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var FormViewEvent                       = bugpack.require('airbug.FormViewEvent');
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

    /**
     * @class
     * @extends {WorkspaceContainer}
     */
    var CodeEditorWorkspaceContainer = Class.extend(WorkspaceContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
             * @type {CodeEditorSettingsWidgetContainer}
             */
            this.codeEditorSettingsWidgetContainer  = null;
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

            view(BoxView)
                .name("boxView")
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.codeEditorWidgetContainer          = new CodeEditorWidgetContainer();
            this.codeEditorSettingsWidgetContainer  = new CodeEditorSettingsWidgetContainer();
            this.addContainerChild(this.codeEditorWidgetContainer, "#box-" + this.boxView.getCid());
            this.addContainerChild(this.codeEditorSettingsWidgetContainer, "#box-" + this.boxView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.getWorkspaceModule().deregisterWorkspace(CodeEditorWorkspace.WORKSPACE_NAME);

            this.codeEditorSettingsWidgetContainer.getViewTop().removeEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);

            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_SETTINGS, this.handleDisplayCodeEditorSettingsCommand, this);
            this.commandModule.unsubscribe(CommandType.TOGGLE.CODE_EDITOR, this.handleToggleCodeEditorCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.codeEditorWidgetContainer.hideWidget();
            this.codeEditorSettingsWidgetContainer.hideWidget();
            this.getWorkspaceModule().registerWorkspace(CodeEditorWorkspace.WORKSPACE_NAME, this);

            this.codeEditorSettingsWidgetContainer.getViewTop().addEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);

            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_SETTINGS, this.handleDisplayCodeEditorSettingsCommand, this);
            this.commandModule.subscribe(CommandType.TOGGLE.CODE_EDITOR, this.handleToggleCodeEditorCommand, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
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
                case "whitespace":
                    var whitespaceBoolean = (data.whitespace === "true") ? true : false;
                    this.codeEditorWidgetContainer.setEditorShowInvisibles(whitespaceBoolean);
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleDisplayCodeEditorCommand: function(message) {
            this.displayCodeEditor();
        },

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleDisplayCodeEditorSettingsCommand: function(message) {
            this.displayCodeEditorSettings();
        },

        /**
         * @private
         * @param {Message} message
         */
        handleToggleCodeEditorCommand: function(message) {
            this.toggleCodeEditor();
        },

        /**
         * @private
         */
        displayCodeEditor: function() {
            this.showWidget(this.codeEditorWidgetContainer, CodeEditorWorkspace.WORKSPACE_NAME);
        },

        /**
         * @private
         */
        displayCodeEditorSettings: function() {
            this.showWidget(this.codeEditorSettingsWidgetContainer, CodeEditorWorkspace.WORKSPACE_NAME);
        },

        /**
         * @private
         */
        toggleCodeEditor: function() {
            this.toggleWidget(this.codeEditorWidgetContainer, CodeEditorWorkspace.WORKSPACE_NAME);
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
});
