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

//@Export('airbug.ImageUploadWidgetContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageUploadContainer')
//@Require('airbug.WorkspaceBoxWithHeaderView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ButtonGroupView')
//@Require('carapace.ButtonToolbarView')
//@Require('carapace.IconView')
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

    var Class                           = bugpack.require('Class');
    var CommandModule                   = bugpack.require('airbug.CommandModule');
    var ImageUploadContainer            = bugpack.require('airbug.ImageUploadContainer');
    var WorkspaceBoxWithHeaderView      = bugpack.require('airbug.WorkspaceBoxWithHeaderView');
    var WorkspaceCloseButtonContainer   = bugpack.require('airbug.WorkspaceCloseButtonContainer');
    var WorkspaceWidgetContainer        = bugpack.require('airbug.WorkspaceWidgetContainer');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var ButtonGroupView                 = bugpack.require('carapace.ButtonGroupView');
    var ButtonToolbarView               = bugpack.require('carapace.ButtonToolbarView');
    var IconView                        = bugpack.require('carapace.IconView');
    var TabView                         = bugpack.require('carapace.TabView');
    var TabViewEvent                    = bugpack.require('carapace.TabViewEvent');
    var TabsView                        = bugpack.require('carapace.TabsView');
    var TextView                        = bugpack.require('carapace.TextView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredTag.autowired;
    var bugmeta                         = BugMeta.context();
    var CommandType                     = CommandModule.CommandType;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {WorkspaceWidgetContainer}
     */
    var ImageUploadWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

        _name: "airbug.ImageUploadWidgetContainer",


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

            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                  = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {TabView}
             */
            this.imageListTabView               = null;

            /**
             * @private
             * @type {ButtonGroupView}
             */
            this.widgetControlButtonGroupView   = null;

            /**
             * @private
             * @type {WorkspaceBoxWithHeaderView}
             */
            this.workspaceBoxView               = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {WorkspaceCloseButtonContainer}
             */
            this.closeButtonContainer           = null;

            /**
             * @private
             * @type {ImageUploadContainer}
             */
            this.imageUploadContainer           = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(WorkspaceBoxWithHeaderView)
                .name("workspaceBoxView")
                .children([
                    view(TabsView)
                        .name("tabsView")
                        .appendTo("#box-header-{{cid}}")
                        .children([
                            view(TabView)
                                .name("imageListTabView")
                                .children([
                                    view(IconView)
                                        .appendTo('a')
                                        .attributes({
                                            type: IconView.Type.PICTURE
                                        }),
                                    view(TextView)
                                        .appendTo('a')
                                        .attributes({
                                            text: "Image List"
                                        })
                                ]),
                            view(TabView)
                                .name("imageUploadTabView")
                                .attributes({
                                    classes: "disabled active"
                                })
                                .children([
                                    view(IconView)
                                        .attributes({
                                            type: IconView.Type.UPLOAD
                                        })
                                        .appendTo('a'),
                                    view(TextView)
                                        .attributes({
                                            text: " Upload"
                                        })
                                        .appendTo('a')
                                ])
                            ]),
                    view(ButtonToolbarView)
                        .appendTo("#box-header-{{cid}}")
                        .children([
                            view(ButtonGroupView)
                                .name("widgetControlButtonGroupView")
                                .appendTo("#button-toolbar-{{cid}}")
                        ])
                ])
                .build(this);

            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.workspaceBoxView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.closeButtonContainer   = new WorkspaceCloseButtonContainer();
            this.addContainerChild(this.closeButtonContainer, "#button-group-" + this.widgetControlButtonGroupView.getCid());
            this.imageUploadContainer   = new ImageUploadContainer();
            this.addContainerChild(this.imageUploadContainer, "#box-body-" + this.workspaceBoxView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.imageListTabView.removeEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.imageListTabView.addEventListener(TabViewEvent.EventType.CLICKED, this.handleUploadListLinkButtonClicked, this);
        },


        //-------------------------------------------------------------------------------
        // Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        handleUploadListLinkButtonClicked: function(event) {
            this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_LIST, {});
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ImageUploadWidgetContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadWidgetContainer", ImageUploadWidgetContainer);
});
