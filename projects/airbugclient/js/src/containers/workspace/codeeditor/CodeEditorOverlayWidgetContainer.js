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

//@Export('airbug.CodeEditorOverlayWidgetContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.CodeEditorBaseWidgetContainer')
//@Require('airbug.CodeEditorOverlayWidgetCloseButtonContainer')
//@Require('airbug.CodeEditorView')
//@Require('airbug.CodeEditorWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('carapace.ButtonGroupView')
//@Require('carapace.ButtonToolbarView')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.IconView')
//@Require('carapace.OverlayView')
//@Require('carapace.OverlayViewEvent')
//@Require('carapace.TabView')
//@Require('carapace.TabViewEvent')
//@Require('carapace.TabsView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                                           = bugpack.require('Class');
    var Ace                                             = bugpack.require('ace.Ace');
    var CodeEditorBaseWidgetContainer                   = bugpack.require('airbug.CodeEditorBaseWidgetContainer');
    var CodeEditorOverlayWidgetCloseButtonContainer     = bugpack.require('airbug.CodeEditorOverlayWidgetCloseButtonContainer');
    var CodeEditorView                                  = bugpack.require('airbug.CodeEditorView');
    var CodeEditorWidgetView                            = bugpack.require('airbug.CodeEditorWidgetView');
    var CommandModule                                   = bugpack.require('airbug.CommandModule');
    var ButtonGroupView                                 = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView                               = bugpack.require('carapace.ButtonToolbarView');
    var ButtonView                                      = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent                                 = bugpack.require('carapace.ButtonViewEvent');
    var IconView                                        = bugpack.require('carapace.IconView');
    var OverlayView                                     = bugpack.require('carapace.OverlayView');
    var OverlayViewEvent                                = bugpack.require('carapace.OverlayViewEvent');
    var TabView                                         = bugpack.require('carapace.TabView');
    var TabViewEvent                                    = bugpack.require('carapace.TabViewEvent');
    var TabsView                                        = bugpack.require('carapace.TabsView');
    var TextView                                        = bugpack.require('carapace.TextView');
    var ViewBuilder                                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var CommandType                                     = CommandModule.CommandType;
    var view                                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CodeEditorBaseWidgetContainer}
     */
    var CodeEditorOverlayWidgetContainer = Class.extend(CodeEditorBaseWidgetContainer, {

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
});
