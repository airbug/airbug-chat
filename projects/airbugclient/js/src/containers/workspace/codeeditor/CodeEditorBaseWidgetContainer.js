//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorBaseWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 *
 * @extends {WorkspaceWidgetContainer}
 */
var CodeEditorBaseWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule                          = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig                     = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorView}
         */
        this.codeEditorView                         = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
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
        this.codeEditorView.setEditorMode("ace/mode/plain_text");
        this.codeEditorView.setEditorTheme("ace/theme/twilight");
        this.codeEditorView.setEditorTabSize(4);
        this.codeEditorView.setEditorUseSoftTabs(true);
        this.codeEditorView.setEditorFontSize(12);
        this.codeEditorView.setEditorShowInvisibles(true);
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
     * @param {*} cursorPosition
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
    getEditorTabType: function(tabType) {
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorBaseWidgetContainer).with(
    autowired().properties([
        property("airbugClientConfig").ref("airbugClientConfig"),
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorBaseWidgetContainer", CodeEditorBaseWidgetContainer);
