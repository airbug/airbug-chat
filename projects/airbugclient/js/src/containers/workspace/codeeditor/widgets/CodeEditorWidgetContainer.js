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
//@Require('airbug.CodeEditorBaseWidgetContainer')
//@Require('airbug.CodeEditorFullscreenButtonContainer')
//@Require('airbug.CodeEditorView')
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
var Ace                                     = bugpack.require('ace.Ace');
var ButtonGroupView                         = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                       = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                              = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                         = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorBaseWidgetContainer           = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
var CodeEditorFullscreenButtonContainer     = bugpack.require('airbug.CodeEditorFullscreenButtonContainer');
var CodeEditorView                          = bugpack.require('airbug.CodeEditorView');
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
        // Declare Variables
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
         * @type {TabView}
         */
        this.editorTabView                          = null;

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
         * @type {CodeEditorWidgetView}
         */
        this.codeEditorWidgetView                   = null;


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

        view(CodeEditorWidgetView)
            .name("codeEditorWidgetView")
            .children([
                view(ButtonToolbarView)
                    .name("buttonToolbarView")
                    .id("code-editor-widget-toolbar")
                    .appendTo("#code-editor-widget-header-{{cid}}")
                    .children([
                        view(ButtonGroupView)
                            .appendTo('#code-editor-widget-toolbar')
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
                                        type: IconView.Type.COG,
                                        color: IconView.Color.WHITE
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
                    .id("code-editor-view")
                    .attributes({
                        width: "300px",
                        height: "200px"
                    })
                    .appendTo("#code-editor-widget-body-{{cid}}"),
                view(ButtonView)
                    .name("sendButtonView")
                    .attributes({
                        type: "default",
                        size: ButtonView.Size.LARGE,
                        block: true
                    })
                    .children([
                        view(TextView)
                            .attributes({text: "Send"})
                            .appendTo("#button-{{cid}}")
                    ])
                    .appendTo("#code-editor-widget-footer-{{cid}}")
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorWidgetView);
        this.codeEditorView     = this.findViewById("code-editor-view");

        Ace.config.set("basePath", this.airbugClientConfig.getStickyStaticUrl());
        this.aceEditor          = Ace.edit(this.codeEditorView.$el.get(0));
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButton                            = new CodeEditorWidgetCloseButtonContainer();
        this.codeEditorFullscreenButtonContainer    = new CodeEditorFullscreenButtonContainer();
        this.addContainerChild(this.codeEditorFullscreenButtonContainer, ".btn-group:last-child");
        this.addContainerChild(this.closeButton, ".btn-group:last-child");
    },

    //-------------------------------------------------------------------------------
    // CodeEditorBaseWidgetContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @override
     */
    initializeEventListeners: function() {
        this._super();
        this.codeEditorFullscreenButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
        this.settingsTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
    },

    /**
     * @private
     * @override
     */
    deinitializeEventListeners: function() {
        this._super();
        this.codeEditorFullscreenButtonContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
        this.settingsTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.hearSettingsTabClickedEvent, this);
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Event} event
     */
    hearFullScreenButtonClickedEvent: function(event) {
        var data    = {
            cursorPosition:     this.getEditorCursorPosition(),
            mode:               this.getEditorMode(),
            showInvisibles:     this.getEditorShowInvisibles(),
            text:               this.getEditorText(),
            theme:              this.getEditorTheme(),
            tabSize:            this.getEditorTabSize()
        };
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, data);
    },

    /**
     * @private
     * @param {TabViewEvent} event
     */
    hearSettingsTabClickedEvent: function(event) {
        event.stopPropagation();
        this.getContainerParent().displayCodeEditorSettings();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
