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

//@Export('airbug.WorkspaceWrapperContainer')

//@Require('Class')
//@Require('airbug.CodeEditorWorkspaceContainer')
//@Require('airbug.ImageWorkspaceContainer')
//@Require('airbug.PanelView')
//@Require('airbug.WorkspaceEvent')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var CodeEditorWorkspaceContainer    = bugpack.require('airbug.CodeEditorWorkspaceContainer');
    var ImageWorkspaceContainer         = bugpack.require('airbug.ImageWorkspaceContainer');
    var PanelView                       = bugpack.require('airbug.PanelView');
    var WorkspaceEvent                  = bugpack.require('airbug.WorkspaceEvent');
    var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredTag.autowired;
    var bugmeta                         = BugMeta.context();
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var WorkspaceWrapperContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.WorkspaceWrapperContainer",


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

            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CodeEditorWorkspaceContainer}
             */
            this.codeEditorWorkspaceContainer       = null;

            /**
             * @private
             * @type {ImageWorkspaceContainer}
             */
            this.imageWorkspaceContainer            = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {WorkspaceModule}
             */
            this.workspaceModule                    = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PanelView}
             */
            this.panelView                          = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CodeEditorWorkspaceContainer}
         */
        getCodeEditorWorkspaceContainer: function() {
            return this.codeEditorWorkspaceContainer;
        },

        /**
         * @return {ImageWorkspaceContainer}
         */
        getImageWorkspaceContainer: function() {
            return this.imageWorkspaceContainer;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array<*>} routerArgs
         */
        activateContainer: function(routerArgs) {
            this._super(routerArgs);
            this.updateWorkspaceVisibility();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Views
            //-------------------------------------------------------------------------------

            view(PanelView)
                .name("panelView")
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.panelView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.codeEditorWorkspaceContainer   = new CodeEditorWorkspaceContainer();
            this.imageWorkspaceContainer        = new ImageWorkspaceContainer();
            this.addContainerChild(this.codeEditorWorkspaceContainer, "#panel-body-" + this.panelView.getCid());
            this.addContainerChild(this.imageWorkspaceContainer, "#panel-body-" + this.panelView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
            this.workspaceModule.removeEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.workspaceModule.addEventListener(WorkspaceEvent.EventType.CLOSED, this.hearWorkspaceClosed, this);
            this.workspaceModule.addEventListener(WorkspaceEvent.EventType.OPENED, this.hearWorkspaceOpened, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        updateWorkspaceVisibility: function() {
            var workspaceIsOpen     = this.workspaceModule.isOpen();
            if (workspaceIsOpen) {
                this.panelView.show();
            } else {
                this.panelView.hide();
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearWorkspaceClosed: function(event) {
            this.updateWorkspaceVisibility();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearWorkspaceOpened: function(event) {
            this.updateWorkspaceVisibility();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkspaceWrapperContainer).with(
        autowired().properties([
            property("workspaceModule").ref("workspaceModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspaceWrapperContainer", WorkspaceWrapperContainer);
});
