//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorOverlayWidgetContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorOverlayWidgetCloseButtonContainer')
//@Require('airbug.CodeEditorOverlayWidgetMinimizeButtonContainer')
//@Require('airbug.CodeEditorSettingsButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.OverlayView')
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
var CodeEditorOverlayWidgetCloseButtonContainer = bugpack.require('airbug.CodeEditorOverlayWidgetCloseButtonContainer');
var CodeEditorOverlayWidgetMinimizeButtonContainer = bugpack.require('airbug.CodeEditorOverlayWidgetMinimizeButtonContainer');
var CodeEditorSettingsButtonContainer   = bugpack.require('airbug.CodeEditorSettingsButtonContainer');
var CodeEditorView                      = bugpack.require('airbug.CodeEditorView');
var CodeEditorWidgetView                = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var OverlayView                         = bugpack.require('airbug.OverlayView');
var TextView                            = bugpack.require('airbug.TextView');
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

var CodeEditorOverlayWidgetContainer = Class.extend(CarapaceContainer, {

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
        this.aceEditor                                      = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule                                  = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig                             = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorView}
         */
        this.codeEditorView                                 = null;

        /**
         * @private
         * @type {OverlayView}
         */
        this.codeEditorOverlayWidgetView                    = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorOverlayWidgetMinimizeButtonContainer}
         */
        this.codeEditorOverlayWidgetMinimizeButtonContainer = null;

        /**
         * @private
         * @type {CodeEditorOverlayWidgetCloseButtonContainer}
         */
        this.closeButton                                    = null;
//
//        /**
//         * @private
//         * @type {CodeEditorSettingsButtonContainer}
//         */
//        this.settingsButton                 = null;
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

        this.codeEditorOverlayWidgetView =
            view(OverlayView)
                .attributes({
                    classes: "code-editor-fullscreen-overlay",
                    size: OverlayView.Size.FULLSCREEN,
                    type: OverlayView.Type.PAGE
                })
                .children([
                    view(CodeEditorWidgetView)
                        .id("code-editor-overlay-widget")
                        .children([
                            view(ButtonToolbarView)
                                .id("code-editor-overlay-widget-toolbar")
                                .appendTo("#code-editor-overlay-widget-header")
                                .children([
                                    view(ButtonGroupView)
                                        .appendTo('#code-editor-overlay-widget-toolbar')
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
                                        .appendTo('#code-editor-overlay-widget-toolbar')
                                ]),
                            view(CodeEditorView)
                                .id("code-editor-overlay-view")
                                .attributes({
//                                    width: "300px",
//                                    height: "200px"
                                })
                                .appendTo("#code-editor-overlay-widget-body"),
                            view(ButtonView)
                                .id("code-editor-overlay-widget-send-code-button")
                                .attributes({
                                    type: "default",
                                    size: ButtonView.Size.LARGE,
                                    block: true
                                })
                                .children([
                                    view(TextView)
                                        .attributes({text: "Send"})
                                        .appendTo("#code-editor-overlay-widget-send-code-button")
                                ])
                                .appendTo("#code-editor-overlay-widget-footer")
                        ])
                        .appendTo(".overlay-body")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorOverlayWidgetView);
        this.sendButtonView     = this.findViewById("code-editor-overlay-widget-send-code-button");
        this.codeEditorView     = this.findViewById("code-editor-overlay-view");

        Ace.config.set("basePath", this.airbugClientConfig.getStickyStaticUrl());
        this.aceEditor          = Ace.edit(this.codeEditorView.$el.get(0));
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.codeEditorOverlayWidgetMinimizeButtonContainer = new CodeEditorOverlayWidgetMinimizeButtonContainer();
        this.closeButton        = new CodeEditorOverlayWidgetCloseButtonContainer();
//        this.settingsButton     = new CodeEditorSettingsButtonContainer();
//        this.addContainerChild(this.settingsButton, ".btn-group:last-child");
        this.addContainerChild(this.codeEditorOverlayWidgetMinimizeButtonContainer, ".btn-group:last-child");
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
        var _this = this;
        this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
        this.codeEditorOverlayWidgetMinimizeButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearMinimizeButtonClickedEvent, this)
//        this.codeEditorOverlayWidgetView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearBackgroundClickedEvent, this);
        this.getViewTop().$el.find(".overlay-background").on('click', function(event){
            _this.hearBackgroundClickedEvent(event);
        });
    },

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
//        this.codeEditorOverlayWidgetView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearBackgroundClickedEvent, this);
        this.getViewTop().$el.find(".overlay-background").off();
    },

    /**
     * @private
     */
    initializeCommandSubscriptions: function() {

    },

    /**
     * @private
     */
    deinitializeCommandSubscriptions: function() {

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

    hearBackgroundClickedEvent: function(event) {
        this.hideFullscreenCodeEditor();
        event.stopPropagation();
    },

    hearMinimizeButtonClickedEvent: function(event) {
        this.hideFullscreenCodeEditor();
        event.stopPropagation();
    },

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
        this.commandModule.relayCommand(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, {});
        event.stopPropagation();
    },

    hideFullscreenCodeEditor: function() {
        this.commandModule.relayCommand(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, {});
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
     * @param {Document}
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
     *
     * @returns {number}
     */
    getEditorTabSize: function() {
        return this.aceEditor.getSession().getTabSize();
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
     *
     */
    setEditorTheme: function(theme) {
        this.aceEditor.setTheme(theme);
    },

    /**
     *
     */
    setEditorToReadOnly: function() {
        if (this.aceEditor) {
            this.aceEditor.setReadOnly(true);
        }
    },

    resizeEditor: function() {
        this.aceEditor.resize();
    },

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

bugmeta.annotate(CodeEditorOverlayWidgetContainer).with(
    autowired().properties([
        property("airbugClientConfig").ref("airbugClientConfig"),
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorOverlayWidgetContainer", CodeEditorOverlayWidgetContainer);
