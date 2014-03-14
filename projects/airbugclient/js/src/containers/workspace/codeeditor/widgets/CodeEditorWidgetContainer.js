//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorBaseWidgetContainer')
//@Require('airbug.CodeEditorFullscreenButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorViewEvent')
//@Require('airbug.CodeEditorWidgetCloseButtonContainer')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('airbug.TabViewEvent')
//@Require('airbug.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var ButtonGroupView                         = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                       = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                         = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorBaseWidgetContainer           = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
var CodeEditorFullscreenButtonContainer     = bugpack.require('airbug.CodeEditorFullscreenButtonContainer');
var CodeEditorView                          = bugpack.require('airbug.CodeEditorView');
var CodeEditorViewEvent                     = bugpack.require('airbug.CodeEditorViewEvent');
var CodeEditorWidgetCloseButtonContainer    = bugpack.require('airbug.CodeEditorWidgetCloseButtonContainer');
var CodeEditorWidgetView                    = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                           = bugpack.require('airbug.CommandModule');
var IconView                                = bugpack.require('airbug.IconView');
var NakedButtonView                         = bugpack.require('airbug.NakedButtonView');
var TabsView                                = bugpack.require('airbug.TabsView');
var TabView                                 = bugpack.require('airbug.TabView');
var TabViewEvent                            = bugpack.require('airbug.TabViewEvent');
var TextView                                = bugpack.require('airbug.TextView');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType                         = CommandModule.CommandType;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorWidgetContainer = Class.extend(CodeEditorBaseWidgetContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonToolbarView}
         */
        this.buttonToolbarView                      = null;

        /**
         * @private
         * @type {CodeEditorWidgetView}
         */
        this.codeEditorWidgetView                   = null;

        /**
         * @private
         * @type {TabView}
         */
        this.editorTabView                          = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.sendButtonView                         = null;

        /**
         * @private
         * @type {ButtonView}
         */
        this.sendSelectedButtonView                 = null;

        /**
         * @private
         * @type {TabView}
         */
        this.settingsTabView                        = null;

        /**
         * @private
         * @type {TabsView}
         */
        this.tabsView                               = null;

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
        this.closeButton                            = null;

        /**
         * @private
         * @type {CodeEditorFullscreenButtonContainer}
         */
        this.codeEditorFullscreenButtonContainer    = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        view(CodeEditorWidgetView)
            .name("codeEditorWidgetView")
            .children([
                view(ButtonToolbarView)
                    .name("buttonToolbarView")
                    .appendTo("#code-editor-widget-header-{{cid}}")
                    .children([
                        view(ButtonGroupView)
                            .name("widgetControlButtonGroupView")
                            .appendTo("#button-toolbar-{{cid}}")
                    ]),
                view(TabsView)
                    .name("tabsView")
                    .appendTo("#code-editor-widget-header-{{cid}}")
                    .children([
                        view(TabView)
                            .name("editorTabView")
                            .attributes({
                                classes: "disabled active"
                            })
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.CHEVRON_LEFT
                                    })
                                    .appendTo('a'),
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.CHEVRON_RIGHT
                                    })
                                    .appendTo('a'),
                                view(TextView)
                                    .attributes({
                                        text: 'Editor'
                                    })
                                    .appendTo('a')
                            ]),
                        view(TabView)
                            .name("settingsTabView")
                            .children([
                                view(IconView)
                                    .attributes({
                                        type: IconView.Type.COG
                                    })
                                    .appendTo('a'),
                                view(TextView)
                                    .attributes({
                                        text: 'Settings'
                                    })
                                    .appendTo('a')
                            ])
                    ]),
                view(CodeEditorView)
                    .name("codeEditorView")
                    .attributes({
                        width: "300px",
                        height: "200px"
                    })
                    .appendTo("#code-editor-widget-body-{{cid}}"),
                view(ButtonToolbarView)
                    .appendTo("#code-editor-widget-footer-{{cid}}")
                    .children([
                        view(ButtonGroupView)
                            .appendTo("#button-toolbar-{{cid}}")
                            .children([
                                view(ButtonView)
                                    .name("sendButtonView")
                                    .appendTo("#button-group-{{cid}}")
                                    .attributes({
                                        type: "default",
                                        size: ButtonView.Size.LARGE
                                    })
                                    .children([
                                        view(TextView)
                                            .attributes({text: "Send"})
                                            .appendTo("#button-{{cid}}")
                                    ])
                            ]),
                        view(ButtonGroupView)
                            .appendTo("#button-toolbar-{{cid}}")
                            .children([
                                view(ButtonView)
                                    .name("sendSelectedButtonView")
                                    .appendTo("#button-group-{{cid}}")
                                    .attributes({
                                        type: "default",
                                        size: ButtonView.Size.LARGE,
                                        block: true,
                                        disabled: true
                                    })
                                    .children([
                                        view(TextView)
                                            .attributes({text: "Send Selected"})
                                            .appendTo("#button-{{cid}}")
                                    ])
                            ])
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorWidgetView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButton                            = new CodeEditorWidgetCloseButtonContainer();
        this.codeEditorFullscreenButtonContainer    = new CodeEditorFullscreenButtonContainer();
        this.addContainerChild(this.codeEditorFullscreenButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid());
        this.addContainerChild(this.closeButton, "#button-group-" + this.widgetControlButtonGroupView.getCid());
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    deinitializeEventListeners: function() {
        this.codeEditorView.removeEventListener(CodeEditorViewEvent.EventType.SELECTION_CHANGED, this.hearCodeEditorSelectionChangedEvent, this);
        this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
        this.sendSelectedButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendSelectedButtonClickedEvent, this);
        this.codeEditorFullscreenButtonContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
        this.settingsTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
    },


    /**
     * @private
     */
    initializeEventListeners: function() {
        this.codeEditorView.addEventListener(CodeEditorViewEvent.EventType.SELECTION_CHANGED, this.hearCodeEditorSelectionChangedEvent, this);
        this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
        this.sendSelectedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendSelectedButtonClickedEvent, this);
        this.codeEditorFullscreenButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
        this.settingsTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CodeEditorViewEvent} event
     */
    hearCodeEditorSelectionChangedEvent: function(event) {
        var copyText = this.getEditorCopyText();
        if (copyText.length > 0) {
            this.sendSelectedButtonView.enableButton();
        } else {
            this.sendSelectedButtonView.disableButton();
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    hearFullScreenButtonClickedEvent: function(event) {
        var data    = {
            cursorPosition: this.getEditorCursorPosition(),
            mode: this.getEditorMode(),
            showInvisibles: this.getEditorShowInvisibles(),
            text: this.getEditorText(),
            theme: this.getEditorTheme(),
            tabSize: this.getEditorTabSize()
        };
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, data);
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
        event.stopPropagation();
    },

    /**
     * @param {ButtonViewEvent} event
     */
    hearSendSelectedButtonClickedEvent: function(event) {
        var code            = this.getEditorCopyText();
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
     * @private
     * @param {TabViewEvent} event
     */
    hearSettingsTabClickedEvent: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR_SETTINGS, {});
        event.stopPropagation();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
