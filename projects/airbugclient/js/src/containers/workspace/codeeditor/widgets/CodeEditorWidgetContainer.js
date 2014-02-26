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
//@Require('airbug.CodeEditorSettingsButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Ace                                 = bugpack.require('ace.Ace');
var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                          = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorBaseWidgetContainer       = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
var CodeEditorFullscreenButtonContainer = bugpack.require('airbug.CodeEditorFullscreenButtonContainer');
var CodeEditorSettingsButtonContainer   = bugpack.require('airbug.CodeEditorSettingsButtonContainer');
var CodeEditorView                      = bugpack.require('airbug.CodeEditorView');
var CodeEditorWidgetView                = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var IconView                            = bugpack.require('airbug.IconView');
var NakedButtonView                     = bugpack.require('airbug.NakedButtonView');
var TextView                            = bugpack.require('airbug.TextView');
var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


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

        /**
         * @private
         * @type {CodeEditorSettingsButtonContainer}
         */
        this.settingsButton                         = null;
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
                    .id("code-editor-widget-toolbar")
                    .appendTo("#code-editor-widget-header-{{cid}}")
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
        this.closeButton                            = new WorkspaceCloseButtonContainer();
        this.settingsButton                         = new CodeEditorSettingsButtonContainer();
        this.codeEditorFullscreenButtonContainer    = new CodeEditorFullscreenButtonContainer();
        this.addContainerChild(this.settingsButton, ".btn-group:last-child");
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
    },

    /**
     * @private
     * @override
     */
    deinitializeEventListeners: function() {
        this._super();
        this.codeEditorFullscreenButtonContainer.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearFullScreenButtonClickedEvent, this);
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
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetContainer", CodeEditorWidgetContainer);
