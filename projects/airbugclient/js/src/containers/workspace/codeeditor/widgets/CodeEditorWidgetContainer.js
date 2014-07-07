//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorWidgetContainer')

//@Require('Class')
//@Require('StateEvent')
//@Require('carapace.ButtonGroupView')
//@Require('carapace.ButtonToolbarView')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('airbug.CodeEditorBaseWidgetContainer')
//@Require('airbug.CodeEditorFullscreenButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorViewEvent')
//@Require('airbug.CodeEditorWidgetCloseButtonContainer')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('carapace.IconView')
//@Require('carapace.TabsView')
//@Require('carapace.TabView')
//@Require('carapace.TabViewEvent')
//@Require('carapace.TextView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                                   = bugpack.require('Class');
    var StateEvent                              = bugpack.require('StateEvent');
    var ButtonGroupView                         = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView                       = bugpack.require('carapace.ButtonToolbarView');
    var ButtonView                              = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent                         = bugpack.require('carapace.ButtonViewEvent');
    var CodeEditorBaseWidgetContainer           = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
    var CodeEditorFullscreenButtonContainer     = bugpack.require('airbug.CodeEditorFullscreenButtonContainer');
    var CodeEditorView                          = bugpack.require('airbug.CodeEditorView');
    var CodeEditorViewEvent                     = bugpack.require('airbug.CodeEditorViewEvent');
    var CodeEditorWidgetCloseButtonContainer    = bugpack.require('airbug.CodeEditorWidgetCloseButtonContainer');
    var CodeEditorWidgetView                    = bugpack.require('airbug.CodeEditorWidgetView');
    var CommandModule                           = bugpack.require('airbug.CommandModule');
    var IconView                                = bugpack.require('carapace.IconView');
    var TabsView                                = bugpack.require('carapace.TabsView');
    var TabView                                 = bugpack.require('carapace.TabView');
    var TabViewEvent                            = bugpack.require('carapace.TabViewEvent');
    var TextView                                = bugpack.require('carapace.TextView');
    var AutowiredTag                     = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                      = bugpack.require('bugioc.PropertyTag');
    var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                               = AutowiredTag.autowired;
    var bugmeta                                 = BugMeta.context();
    var CommandType                             = CommandModule.CommandType;
    var property                                = PropertyTag.property;
    var view                                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CodeEditorBaseWidgetContainer}
     */
    var CodeEditorWidgetContainer = Class.extend(CodeEditorBaseWidgetContainer, {

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
            this.embedButtonView                        = null;

            /**
             * @private
             * @type {ButtonView}
             */
            this.sendButtonView                         = null;

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


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule                   = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            this.processMessageHandlerState();
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
                                            size: ButtonView.Size.LARGE,
                                            disabled: true
                                        })
                                        .children([
                                            view(TextView)
                                                .attributes({text: "Send"})
                                                .appendTo("#button-{{cid}}")
                                        ]),
                                ]),
                            view(ButtonGroupView)
                                .appendTo("#button-toolbar-{{cid}}")
                                .children([
                                    view(ButtonView)
                                        .name("embedButtonView")
                                        .appendTo("#button-group-{{cid}}")
                                        .attributes({
                                            type: "default",
                                            size: ButtonView.Size.LARGE,
                                            disabled: true
                                        })
                                        .children([
                                            view(TextView)
                                                .attributes({text: "Embed"})
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

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
            this.embedButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClickedEvent, this);
            this.codeEditorFullscreenButtonContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
            this.settingsTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
            this.messageHandlerModule.removeEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
            this.embedButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearEmbedButtonClickedEvent, this);
            this.codeEditorFullscreenButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
            this.settingsTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
            this.messageHandlerModule.addEventListener(StateEvent.EventTypes.STATE_CHANGED, this.hearMessageHandlerModuleStateChanged, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        processMessageHandlerState: function() {
            if (this.messageHandlerModule.doesSupportEmbed()) {
                this.embedButtonView.enableButton();
            } else {
                this.embedButtonView.disableButton();
            }
            if (this.messageHandlerModule.doesSupportSend()) {
                this.sendButtonView.enableButton();
            } else {
                this.sendButtonView.disableButton();
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

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
         * @private
         * @param {Event} event
         */
        hearMessageHandlerModuleStateChanged: function(event) {
            this.processMessageHandlerState();
        },

        /**
         * @param {ButtonViewEvent} event
         */
        hearSendButtonClickedEvent: function(event) {
            var code            = this.getEditorCopyText() || this.getEditorText();
            var codeLanguage    = this.getEditorLanguage();
            var chatMessageObject = {
                type: "code",
                body: {parts: [{
                    code: code,
                    type: "code",
                    codeLanguage: codeLanguage
                }]}
            };

            this.messageHandlerModule.sendMessage(chatMessageObject);
            event.stopPropagation();
        },

        /**
         * @param {ButtonViewEvent} event
         */
        hearEmbedButtonClickedEvent: function(event) {
            var code                    = this.getEditorCopyText() || this.getEditorText();
            var codeLanguage            = this.getEditorLanguage();
            var codeMessagePartObject   = {
                code: code,
                type: "code",
                codeLanguage: codeLanguage
            };

            this.messageHandlerModule.embedMessagePart(codeMessagePartObject);
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
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CodeEditorWidgetContainer).with(
        autowired().properties([
            property("messageHandlerModule").ref("messageHandlerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
});
