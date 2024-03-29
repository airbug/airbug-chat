/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorWorkspaceContainer')

//@Require('Class')
//@Require('airbug.CodeEditorSettingsWidgetContainer')
//@Require('airbug.CodeEditorWidgetContainer')
//@Require('airbug.CodeEditorWorkspace')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.BoxView')
//@Require('carapace.FormViewEvent')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var CodeEditorSettingsWidgetContainer   = bugpack.require('airbug.CodeEditorSettingsWidgetContainer');
    var CodeEditorWidgetContainer           = bugpack.require('airbug.CodeEditorWidgetContainer');
    var CodeEditorWorkspace                 = bugpack.require('airbug.CodeEditorWorkspace');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var WorkspaceContainer                  = bugpack.require('airbug.WorkspaceContainer');
    var AutowiredTag                        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                         = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var BoxView                             = bugpack.require('carapace.BoxView');
    var FormViewEvent                       = bugpack.require('carapace.FormViewEvent');
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
    var CodeEditorWorkspaceContainer = Class.extend(WorkspaceContainer, {

        _name: "airbug.CodeEditorWorkspaceContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super(CodeEditorWorkspace.WORKSPACE_NAME);


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
        createContainerChildren: function() {
            this._super();
            this.codeEditorWidgetContainer          = new CodeEditorWidgetContainer();
            this.codeEditorSettingsWidgetContainer  = new CodeEditorSettingsWidgetContainer();
            this.addContainerChild(this.codeEditorWidgetContainer, "#workspace-" + this.getWorkspaceView().getCid());
            this.addContainerChild(this.codeEditorSettingsWidgetContainer, "#workspace-" + this.getWorkspaceView().getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();

            this.deregisterWidget(CodeEditorWorkspace.WidgetNames.EDITOR);
            this.deregisterWidget(CodeEditorWorkspace.WidgetNames.SETTINGS);

            this.codeEditorSettingsWidgetContainer.getViewTop().removeEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);

            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_SETTINGS, this.handleDisplayCodeEditorSettingsCommand, this);
            this.commandModule.unsubscribe(CommandType.TOGGLE.CODE_EDITOR, this.handleToggleCodeEditorCommand, this);
            this.commandModule.unsubscribe(CommandType.TOGGLE.CODE_WORKSPACE, this.handleToggleCodeWorkspaceCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();

            if (!this.getCurrentWidgetName()) {
                this.setCurrentWidgetName(CodeEditorWorkspace.WidgetNames.EDITOR);
            }

            this.registerWidget(CodeEditorWorkspace.WidgetNames.EDITOR, this.codeEditorWidgetContainer);
            this.registerWidget(CodeEditorWorkspace.WidgetNames.SETTINGS, this.codeEditorSettingsWidgetContainer);

            this.codeEditorSettingsWidgetContainer.getViewTop().addEventListener(FormViewEvent.EventType.CHANGE, this.handleSettingsChangeEvent, this);

            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_SETTINGS, this.handleDisplayCodeEditorSettingsCommand, this);
            this.commandModule.subscribe(CommandType.TOGGLE.CODE_EDITOR, this.handleToggleCodeEditorCommand, this);
            this.commandModule.subscribe(CommandType.TOGGLE.CODE_WORKSPACE, this.handleToggleCodeWorkspaceCommand, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        openCodeEditor: function() {
            this.openWidget(CodeEditorWorkspace.WidgetNames.EDITOR);
        },

        /**
         * @private
         */
        openCodeEditorSettings: function() {
            this.openWidget(CodeEditorWorkspace.WidgetNames.SETTINGS);
        },

        /**
         * @private
         */
        toggleCodeEditor: function() {
            this.toggleWidget(CodeEditorWorkspace.WidgetNames.EDITOR);
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
            this.openCodeEditor();
        },

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleDisplayCodeEditorSettingsCommand: function(message) {
            this.openCodeEditorSettings();
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
         * @param {Message} message
         */
        handleToggleCodeWorkspaceCommand: function(message) {
            this.toggleWorkspace();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CodeEditorWorkspaceContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorWorkspaceContainer", CodeEditorWorkspaceContainer);
});
