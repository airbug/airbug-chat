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

//@Export('airbug.CodeEditorBaseWidgetContainer')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var TypeUtil                            = bugpack.require('TypeUtil');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {WorkspaceWidgetContainer}
     */
    var CodeEditorBaseWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

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

            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {PageStateModule}
             */
            this.pageStateModule                        = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig                     = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CodeEditorView}
             */
            this.codeEditorView                         = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------


        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
            this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_TEXT, this.handleSetTextCommand, this);
            this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
            this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_THEME, this.handleSetThemeCommand, this);

            var cursorPosition  = this.getEditorCursorPosition();
            var mode            = this.getEditorMode();
            var showInvisibles  = this.getEditorShowInvisibles();
            var tabSize         = this.getEditorTabSize();
            var tabType         = this.getEditorTabType();
            var text            = this.getEditorText();
            var theme           = this.getEditorTheme();

            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_CURSOR_POSITION, cursorPosition);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_MODE, mode);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_SHOW_INVISIBLES, showInvisibles);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TAB_SIZE, tabSize);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TAB_TYPE, tabType);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TEXT, text);
            this.pageStateModule.putState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_THEME, theme);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
            this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_TEXT, this.handleSetTextCommand, this);
            this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
            this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_THEME, this.handleSetThemeCommand, this);
            this.configureEditor();
        },


        //-------------------------------------------------------------------------------
        // WorkspaceWidgetContainer Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        showWidget: function() {
            this._super();
            this.focusEditor();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        configureEditor: function() {
            var cursorPosition  = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_CURSOR_POSITION) || {row: 0, column: 0};
            var mode            = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_MODE) || "ace/mode/plain_text";
            var showInvisibles  = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_SHOW_INVISIBLES);
            var tabSize         = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TAB_SIZE) || 4;
            var tabType         = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TAB_TYPE) || "soft";
            var text            = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_TEXT) || "";
            var theme           = this.pageStateModule.getState(CodeEditorBaseWidgetContainer.PageStates.EDITOR_THEME) || "ace/theme/twilight";

            showInvisibles = TypeUtil.isBoolean(showInvisibles) ? showInvisibles : true;

            this.setEditorMode(mode);
            this.setEditorTabSize(tabSize);
            this.setEditorTabType(tabType);
            this.setEditorText(text);
            this.setEditorTheme(theme);
            this.setEditorFontSize(12);
            this.setEditorShowInvisibles(showInvisibles);
            this.setEditorDragEnabled(true);
            this.setEditorCursorPosition(cursorPosition);
        },

        /**
         * @return {Ace}
         */
        getEditor: function() {
            return this.codeEditorView.getEditor();
        },

        /**
         * @return {string}
         */
        getEditorCopyText: function() {
            return this.codeEditorView.getEditorCopyText();
        },

        /**
         * @return {*}
         */
        getEditorCursorPosition: function() {
            return this.codeEditorView.getEditorCursorPosition();
        },

        /**
         * @param {{
         *      column: number,
         *      row: number
         * }} cursorPosition
         */
        setEditorCursorPosition: function(cursorPosition) {
            this.codeEditorView.setEditorCursorPosition(cursorPosition);
        },

        /**
         * @returns {Document} document
         */
        getEditorDocument: function() {
            return this.codeEditorView.getEditorDocument();
        },

        /**
         * @param {Document} document
         */
        setEditorDocument: function(document) {
            this.codeEditorView.setEditorDocument(document);
        },

        /**
         * @param {boolean} dragEnabled
         */
        setEditorDragEnabled: function(dragEnabled) {
            this.codeEditorView.setEditorDragEnabled(dragEnabled);
        },

        /**
         * @return {number}
         */
        getEditorFontSize: function(fontSize) {
            return this.codeEditorView.getEditorFontSize();
        },

        /**
         * @param {number} fontSize
         */
        setEditorFontSize: function(fontSize) {
            this.codeEditorView.setEditorFontSize(fontSize);
        },

        /**
         * @return {string}
         */
        getEditorLanguage: function() {
            return this.codeEditorView.getEditorLanguage();
        },

        /**
         * @return {string}
         */
        getEditorMode: function() {
            return this.codeEditorView.getEditorMode();
        },

        /**
         * @param {string} mode
         */
        setEditorMode: function(mode) {
            this.codeEditorView.setEditorMode(mode);
        },

        /**
         * @return {number}
         */
        getEditorTabSize: function() {
            return this.codeEditorView.getEditorTabSize();
        },

        /**
         * @param {number} tabSize
         */
        setEditorTabSize: function(tabSize) {
            this.codeEditorView.setEditorTabSize(tabSize);
        },

        /**
         * @return {string}
         */
        getEditorTabType: function() {
            return this.codeEditorView.getEditorTabType();
        },

        /**
         * @param {string} tabType
         */
        setEditorTabType: function(tabType) {
            this.codeEditorView.setEditorTabType(tabType);
        },

        /**
         * @return {string}
         */
        getEditorText: function() {
            return this.codeEditorView.getEditorText();
        },

        /**
         * @param {string} value
         */
        setEditorText: function(value) {
            this.codeEditorView.setEditorText(value);
        },

        /**
         * @return {string}
         */
        getEditorTheme: function() {
            return this.codeEditorView.getEditorTheme();
        },

        /**
         * @param {string} theme
         */
        setEditorTheme: function(theme) {
            this.codeEditorView.setEditorTheme(theme);
        },

        /**
         * @return {boolean}
         */
        getEditorReadOnly: function() {
            return this.codeEditorView.getEditorReadOnly();
        },

        /**
         * @param {boolean} readOnly
         */
        setEditorReadOnly: function(readOnly) {
            this.codeEditorView.setEditorReadOnly(readOnly);
        },

        /**
         * @return {boolean}
         */
        getEditorShowInvisibles: function() {
            return this.codeEditorView.getEditorShowInvisibles();
        },

        /**
         * @param {boolean} showInvisibles
         */
        setEditorShowInvisibles: function(showInvisibles) {
            this.codeEditorView.setEditorShowInvisibles(showInvisibles);
        },

        /**
         *
         */
        resizeEditor: function() {
            this.codeEditorView.resizeEditor();
        },

        /**
         *
         */
        focusEditor: function() {
            this.codeEditorView.focusEditor();
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PublisherMessage} message
         */
        handleDisplayCodeCommand: function(message) {
            var code = message.getData().code;
            this.setEditorText(code);
        },

        /**
         * @private
         * @type {PublisherMessage} message
         */
        handleSetTextCommand: function(message) {
            var text = message.getData().text;
            this.setEditorText(text);
        },

        /**
         * @private
         * @type {PublisherMessage} message
         */
        handleSetModeCommand: function(message) {
            var mode = message.getData().mode;
            this.setEditorMode(mode);
        },

        /**
         * @private
         * @type {PublisherMessage} message
         */
        handleSetThemeCommand: function(message) {
            var theme = message.getData().theme;
            this.setEditorTheme(theme);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    CodeEditorBaseWidgetContainer.PageStates = {
        EDITOR_CURSOR_POSITION: "CodeEditorBaseWidgetContainer:PageState:EditorCursorPosition",
        EDITOR_MODE: "CodeEditorBaseWidgetContainer:PageState:EditorMode",
        EDITOR_SHOW_INVISIBLES: "CodeEditorBaseWidgetContainer:PageState:EditorShowInvisibles",
        EDITOR_TAB_SIZE: "CodeEditorBaseWidgetContainer:PageState:EditorTabSize",
        EDITOR_TAB_TYPE: "CodeEditorBaseWidgetContainer:PageState:EditorTabType",
        EDITOR_TEXT: "CodeEditorBaseWidgetContainer:PageState:EditorText",
        EDITOR_THEME: "CodeEditorBaseWidgetContainer:PageState:EditorTheme"
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CodeEditorBaseWidgetContainer).with(
        autowired().properties([
            property("airbugStaticConfig").ref("airbugStaticConfig"),
            property("commandModule").ref("commandModule"),
            property("pageStateModule").ref("pageStateModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorBaseWidgetContainer", CodeEditorBaseWidgetContainer);
});
