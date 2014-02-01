//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorSettingsButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
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
var Ace                                 = bugpack.require('ace.Ace');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                          = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorSettingsButtonContainer   = bugpack.require('airbug.CodeEditorSettingsButtonContainer');
var CodeEditorView                      = bugpack.require('airbug.CodeEditorView');
var CodeEditorWidgetView                = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
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

var CodeEditorWidgetContainer = Class.extend(CarapaceContainer, {

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
        this.aceEditor                  = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule              = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig         = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorView}
         */
        this.codeEditorView             = null;

        /**
         * @private
         * @type {CodeEditorWidgetView}
         */
        this.codeEditorWidgetView       = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WorkspaceCloseButtonContainer}
         */
        this.closeButton                = null;

        /**
         * @private
         * @type {CodeEditorSettingsButtonContainer}
         */
        this.settingsButton             = null;
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

        this.codeEditorWidgetView =
            view(CodeEditorWidgetView)
                .id("code-editor-widget")
                .children([
                    view(ButtonToolbarView)
                        .id("code-editor-widget-toolbar")
                        .appendTo("#code-editor-widget-header")
                        .children([
                            view(ButtonGroupView)
                                .appendTo('#code-editor-widget-toolbar')
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
                                                    type: IconView.Type.CHEVRON_LEFT,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(IconView)
                                                .attributes({
                                                    type: IconView.Type.CHEVRON_RIGHT,
                                                    color: IconView.Color.WHITE
                                                })
                                                .appendTo('button[id|="button"]'),
                                            view(TextView)
                                                .attributes({
                                                    text: 'Editor'
                                                })
                                                .appendTo('button[id|="button"]')
                                        ])
                                ]),
                            view(ButtonGroupView)
                                .appendTo('#code-editor-widget-toolbar')
                        ]),
                    view(CodeEditorView)
                        .id("code-editor-view")
                        .attributes({
                            width: "300px",
                            height: "200px"
                        })
                        .appendTo("#code-editor-widget-body"),
                    view(ButtonView)
                        .id("send-code-button")
                        .attributes({
                            type: "default",
                            size: ButtonView.Size.LARGE,
                            block: true
                        })
                        .children([
                            view(TextView)
                                .attributes({text: "Send"})
                                .appendTo("#send-code-button")
                        ])
                        .appendTo("#code-editor-widget-footer")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorWidgetView);
        this.sendButtonView     = this.findViewById("send-code-button");
        this.codeEditorView     = this.findViewById("code-editor-view");

        Ace.config.set("basePath", this.airbugClientConfig.getStickyStaticUrl());
        this.aceEditor          = Ace.edit(this.codeEditorView.$el.get(0));
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButton        = new WorkspaceCloseButtonContainer();
        this.settingsButton     = new CodeEditorSettingsButtonContainer();
        this.addContainerChild(this.settingsButton, ".btn-group:last-child");
        this.addContainerChild(this.closeButton, ".btn-group:last-child");
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
        this.configureAceEditor();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
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
     * @private
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
        this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE, this.handleDisplayCodeCommand, this);
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR, this.handleDisplayCodeEditorCommand, this);
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @type {PublisherMessage} message
     */
    handleDisplayCodeCommand: function(message) {
        var code = message.getData().code;
        this.setEditorText(code);
    },

    handleDisplayCodeEditorCommand: function(message) {
        this.focusOnAceEditor();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
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


    //-------------------------------------------------------------------------------
    // Ace Config and Helper Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configureAceEditor: function() {
        this.aceEditor.getSession().setMode("ace/mode/plain_text");
        this.aceEditor.setTheme("ace/theme/twilight");
        this.aceEditor.getSession().setTabSize(4);
        this.aceEditor.getSession().setUseSoftTabs(true);
        this.aceEditor.setFontSize(12);
    },

    /**
     * @return {Ace}
     */
    getEditor: function() {
        return this.aceEditor;
    },

    /**
     * @returns {Document}
     */
    getEditorDocument: function() {
        return this.aceEditor.getSession().getDocument();
    },

    /**
     * @param {number} fontSize
     */
    setEditorFontSize: function(fontSize) {
        this.aceEditor.setFontSize(fontSize);

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
     * @param {string} mode
     */
    setEditorMode: function(mode) {
        this.aceEditor.getSession().setMode(mode);
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
     * @param {string} value
     */
    setEditorText: function(value) {
        if (this.aceEditor) {
            this.aceEditor.setValue(value);
        }
    },

    /**
     * @return {string}
     */
    getEditorTheme: function() {
        return this.aceEditor.getTheme();
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
        aceEditor.gotoLine(count, session.getLine(count-1).length);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CodeEditorWidgetContainer).with(
    autowired().properties([
        property("airbugClientConfig").ref("airbugClientConfig"),
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
