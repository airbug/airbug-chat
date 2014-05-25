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
//@Require('airbug.ButtonGroupView')
//@Require('airbug.ButtonToolbarView')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ImageUploadContainer')
//@Require('airbug.TabsView')
//@Require('airbug.TabView')
//@Require('airbug.TabViewEvent')
//@Require('airbug.TextView')
//@Require('airbug.WorkspaceBoxWithHeaderView')
//@Require('airbug.WorkspaceCloseButtonContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ButtonGroupView                     = bugpack.require('airbug.ButtonGroupView');
    var ButtonToolbarView                   = bugpack.require('airbug.ButtonToolbarView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var IconView                            = bugpack.require('airbug.IconView');
    var ImageUploadContainer                = bugpack.require('airbug.ImageUploadContainer');
    var TabsView                            = bugpack.require('airbug.TabsView');
    var TabView                             = bugpack.require('airbug.TabView');
    var TabViewEvent                        = bugpack.require('airbug.TabViewEvent');
    var TextView                            = bugpack.require('airbug.TextView');
    var WorkspaceBoxWithHeaderView          = bugpack.require('airbug.WorkspaceBoxWithHeaderView');
    var WorkspaceCloseButtonContainer       = bugpack.require('airbug.WorkspaceCloseButtonContainer');
    var WorkspaceWidgetContainer            = bugpack.require('airbug.WorkspaceWidgetContainer');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;


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

    bugmeta.annotate(ImageUploadWidgetContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadWidgetContainer", ImageUploadWidgetContainer);
});
