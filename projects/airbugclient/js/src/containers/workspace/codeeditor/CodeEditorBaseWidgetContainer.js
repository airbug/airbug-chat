//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorBaseWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


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
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Ace}
         */
        this.aceEditor                              = null;


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
        this.configureAceEditor();
    },


    //-------------------------------------------------------------------------------
    // WorkspaceWidgetContainer Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    showWidget: function() {
        this._super();
        this.focusOnAceEditor();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeEventListeners: function() {
        this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
    },

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
    },

    /**
     * @protected
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
        this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_TEXT, this.handleSetTextCommand, this);
        this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
        this.commandModule.subscribe(CommandType.CODE_EDITOR.SET_THEME, this.handleSetThemeCommand, this);
    },

    /**
     * @protected
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
        this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_TEXT, this.handleSetTextCommand, this);
        this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_MODE, this.handleSetModeCommand, this);
        this.commandModule.unsubscribe(CommandType.CODE_EDITOR.SET_THEME, this.handleSetThemeCommand, this);
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
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {ButtonViewEvent} event
     */
    hearSendButtonClickedEvent: function(event) {
        var code            = this.getEditorText();
        var codeLanguage    = this.getEditorLanguage();
        var chatMessageObject = {
            type: "code",
            body: {parts: [{
                code: code,
                type: "code",
                codeLanguage: codeLanguage
            }]}
        };

        this.commandModule.relayCommand(CommandType.SUBMIT.CHAT_MESSAGE, chatMessageObject);
        event.stopPropagation();
    },

    /**
     * @protected
     */
    hideFullscreenCodeEditor: function() {
        this.commandModule.relayCommand(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, {});
    },

    //-------------------------------------------------------------------------------
    // Ace Config and Helper Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    configureAceEditor: function() {
        //refactor to use helper methods.
        this.aceEditor.getSession().setMode("ace/mode/plain_text");
        this.aceEditor.setTheme("ace/theme/twilight");
        this.aceEditor.getSession().setTabSize(4);
        this.aceEditor.getSession().setUseSoftTabs(true);
        this.aceEditor.setFontSize(12);
        this.aceEditor.setOption("showInvisibles", true);
    },

    //-------------------------------------------------------------------------------
    // Getters
    //-------------------------------------------------------------------------------

    /**
     * @return {Ace}
     */
    getEditor: function() {
        return this.aceEditor;
    },

    /**
     * @return {*}
     */
    getEditorCursorPosition: function() {
        return this.aceEditor.getCursorPosition();
    },

    /**
     * @returns {Document} document
     */
    getEditorDocument: function() {
        return this.aceEditor.getSession().getDocument();
    },

    /**
     * @return {string}
     */
    getEditorLanguage: function() {
        var mode = this.aceEditor.getSession().getMode().$id;
        return mode.substring(mode.lastIndexOf("/") + 1);
    },

    /**
     * @return {string}
     */
    getEditorMode: function() {
        return this.aceEditor.getSession().getMode().$id;
    },

    /**
     *
     * @returns {number}
     */
    getEditorTabSize: function() {
        return this.aceEditor.getSession().getTabSize();
    },

    /**
     * @return {string}
     */
    getEditorText: function() {
        if (this.aceEditor) {
            return this.aceEditor.getValue();
        } else {
            return "";
        }
    },

    /**
     * @return {string}
     */
    getEditorTheme: function() {
        return this.aceEditor.getTheme();
    },

    /**
     * @return {boolean}
     */
    getEditorShowInvisibles: function() {
        this.aceEditor.getOption("showInvisibles");
    },

    //-------------------------------------------------------------------------------
    // Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {*} cursorPosition
     */
    setEditorCursorPosition: function(cursorPosition) {
        this.aceEditor.moveCursorToPosition(cursorPosition);
    },

    /**
     * @param {Document} document
     */
    setEditorDocument: function(document) {
        this.aceEditor.getSession().setDocument(document);
    },

    /**
     * @param {number} fontSize
     */
    setEditorFontSize: function(fontSize) {
        this.aceEditor.setFontSize(fontSize);

    },

    /**
     * @param {string} mode
     */
    setEditorMode: function(mode) {
        this.aceEditor.getSession().setMode(mode);
    },

    /**
     * @param {boolean} boolean
     */
    setEditorShowInvisibles: function(boolean) {
        this.aceEditor.setOption("showInvisibles", boolean);
    },

    /**
     * @param {number} tabSize
     */
    setEditorTabSize: function(tabSize) {
        this.aceEditor.getSession().setTabSize(tabSize);
        console.log("tab size has been set to", this.aceEditor.getSession().getTabSize()); //maybe make these into notifications
    },

    /**
     * @param {string | boolean} tabType
     */
    setEditorTabType: function(tabType) {
        if(tabType === "soft") {
            tabType = true;
        } else if(tabType === "hard") {
            tabType = false;
        }
        this.aceEditor.getSession().setUseSoftTabs(tabType);
        console.log("tabs have been set to", '"' + this.aceEditor.getSession().getTabString() + '"'); //maybe make these into notifications
    },

    /**
     * @param {string} value
     */
    setEditorText: function(value) {
        if (this.aceEditor) {
            this.aceEditor.setValue(value);
        }
    },

    /**
     * @param {string} theme
     */
    setEditorTheme: function(theme) {
        this.aceEditor.setTheme(theme);
        console.log("theme has been set to", this.getEditorTheme());
    },

    /**
     *
     */
    setEditorToReadOnly: function() {
        if (this.aceEditor) {
            this.aceEditor.setReadOnly(true);
        }
    },

    /**
     * @param {boolean} boolean
     */
    setWhitespace: function(boolean) {
        this.setEditorShowInvisibles(boolean);
    },

    //-------------------------------------------------------------------------------
    // Others
    //-------------------------------------------------------------------------------

    /**
     *
     */
    resizeEditor: function() {
        this.aceEditor.resize();
    },

    /**
     *
     */
    focusOnAceEditor: function() {
        var aceEditor = this.aceEditor;
        var session = aceEditor.getSession();
        var count = session.getLength();
        aceEditor.focus();
        //aceEditor.gotoLine(count, session.getLine(count-1).length);
    },

    /**
     *
     */
    clearSelection: function() {
        this.aceEditor.clearSelection();
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
