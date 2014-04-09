//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorOverlayWidgetContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorBaseWidgetContainer')
//@Require('airbug.CodeEditorOverlayWidgetCloseButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.OverlayView')
//@Require('airbug.OverlayViewEvent')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('airbug.TabViewEvent')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                           = bugpack.require('Class');
var Ace                                             = bugpack.require('ace.Ace');
var ButtonGroupView                                 = bugpack.require('airbug.ButtonGroupView');
var ButtonToolbarView                               = bugpack.require('airbug.ButtonToolbarView');
var ButtonView                                      = bugpack.require('airbug.ButtonView');
var ButtonViewEvent                                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorBaseWidgetContainer                   = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
var CodeEditorOverlayWidgetCloseButtonContainer     = bugpack.require('airbug.CodeEditorOverlayWidgetCloseButtonContainer');
var CodeEditorView                                  = bugpack.require('airbug.CodeEditorView');
var CodeEditorWidgetView                            = bugpack.require('airbug.CodeEditorWidgetView');
var CommandModule                                   = bugpack.require('airbug.CommandModule');
var IconView                                        = bugpack.require('airbug.IconView');
var NakedButtonView                                 = bugpack.require('airbug.NakedButtonView');
var OverlayView                                     = bugpack.require('airbug.OverlayView');
var OverlayViewEvent                                = bugpack.require('airbug.OverlayViewEvent');
var TabsView                                        = bugpack.require('airbug.TabsView');
var TabView                                         = bugpack.require('airbug.TabView');
var TabViewEvent                                    = bugpack.require('airbug.TabViewEvent');
var TextView                                        = bugpack.require('airbug.TextView');
var ViewBuilder                                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType = CommandModule.CommandType;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @extends {CodeEditorBaseWidgetContainer}
 */
var CodeEditorOverlayWidgetContainer = Class.extend(CodeEditorBaseWidgetContainer, {

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
         * @type {OverlayView}
         */
        this.codeEditorOverlayWidgetView                    = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CodeEditorOverlayWidgetCloseButtonContainer}
         */
        this.closeButton                                    = null;
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

        // Create Views
        //-------------------------------------------------------------------------------

        view(OverlayView)
            .name("codeEditorOverlayWidgetView")
            .attributes({
                classes: "code-editor-fullscreen-overlay",
                size: OverlayView.Size.FULLSCREEN,
                type: OverlayView.Type.PAGE
            })
            .children([
                view(CodeEditorWidgetView)
                    .appendTo("#overlay-body-{{cid}}")
                    .children([
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
                                    ])
                            ]),
                        view(ButtonToolbarView)
                            .id("code-editor-overlay-widget-toolbar")
                            .appendTo("#code-editor-widget-header-{{cid}}")
                            .children([
                                view(ButtonGroupView)
                                    .appendTo("#button-toolbar-{{cid}}")
                            ]),
                        view(CodeEditorView)
                            .name("codeEditorView")
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
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.codeEditorOverlayWidgetView);

        Ace.config.set("basePath", this.airbugClientConfig.getStickyStaticUrl());
        this.aceEditor          = Ace.edit(this.codeEditorView.$el.get(0));
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.closeButton        = new CodeEditorOverlayWidgetCloseButtonContainer();
        this.addContainerChild(this.closeButton, ".btn-group:last-child");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.codeEditorOverlayWidgetView.removeEventListener(OverlayViewEvent.EventType.CLOSE, this.hearOverlayCloseEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.codeEditorOverlayWidgetView.addEventListener(OverlayViewEvent.EventType.CLOSE, this.hearOverlayCloseEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @param {ButtonViewEvent} event
     */
    hearSendButtonClickedEvent: function(event) {
        this._super(event);
        this.commandModule.relayCommand(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, {});
    },


    //-------------------------------------------------------------------------------
    // Ace Config and Helper Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     */
    configureAceEditor: function() {
        //None
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {} event
     */
    hearOverlayCloseEvent: function(event) {
        this.hideFullscreenCodeEditor();
        event.stopPropagation();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorOverlayWidgetContainer", CodeEditorOverlayWidgetContainer);
