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

//@Export('airbug.WorkspacePageContainer')

//@Require('Class')
//@Require('airbug.PageContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.WorkspaceEvent')
//@Require('airbug.WorkspaceTrayContainer')
//@Require('airbug.WorkspaceWrapperContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.FourColumnView')
//@Require('carapace.MultiColumnView')
//@Require('carapace.PageView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var PageContainer        = bugpack.require('airbug.PageContainer');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var WorkspaceEvent              = bugpack.require('airbug.WorkspaceEvent');
    var WorkspaceTrayContainer      = bugpack.require('airbug.WorkspaceTrayContainer');
    var WorkspaceWrapperContainer   = bugpack.require('airbug.WorkspaceWrapperContainer');
    var AutowiredTag                = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                 = bugpack.require('bugioc.PropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var FourColumnView              = bugpack.require('carapace.FourColumnView');
    var MultiColumnView             = bugpack.require('carapace.MultiColumnView');
    var PageView                    = bugpack.require('carapace.PageView');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                   = AutowiredTag.autowired;
    var bugmeta                     = BugMeta.context();
    var CommandType                 = CommandModule.CommandType;
    var property                    = PropertyTag.property;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {PageContainer}
     */
    var WorkspacePageContainer = Class.extend(PageContainer, {

        _name: "airbug.WorkspacePageContainer",


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
             * @type {WorkspaceModule}
             */
            this.workspaceModule            = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {WorkspaceTrayContainer}
             */
            this.workspaceTrayContainer     = null;

            /**
             * @private
             * @type {WorkspaceWrapperContainer}
             */
            this.workspaceWrapperContainer  = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {WorkspaceModule}
         */
        getWorkspaceModule: function() {
            return this.workspaceModule;
        },

        /**
         * @return {WorkspaceTrayContainer}
         */
        getWorkspaceTrayContainer: function() {
            return this.workspaceTrayContainer;
        },

        /**
         * @return {WorkspaceWrapperContainer}
         */
        getWorkspaceWrapperContainer: function() {
            return this.workspaceWrapperContainer;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.workspaceTrayContainer     = new WorkspaceTrayContainer();
            this.addContainerChild(this.workspaceTrayContainer, "#column4of4-" + this.fourColumnView.getCid());
            this.workspaceWrapperContainer   = new WorkspaceWrapperContainer();
            this.addContainerChild(this.workspaceWrapperContainer, "#column3of4-" + this.fourColumnView.getCid());
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
        updateColumnSpans: function() {
            var hamburgerLeft           = this.fourColumnView.getColumn1Of4Element();
            var roomspace               = this.fourColumnView.getColumn2Of4Element();
            var workspace               = this.fourColumnView.getColumn3Of4Element();
            var hamburgerLeftIsOpen     = !hamburgerLeft.hasClass("hamburger-panel-hidden");
            var workspaceIsOpen         = this.workspaceModule.isOpen();

            if (hamburgerLeftIsOpen) {
                if (workspaceIsOpen) {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span5");
                    workspace.addClass("span3");
                } else {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span8");
                    workspace.addClass("span0");
                }
            } else {
                if (workspaceIsOpen) {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span8");
                    workspace.addClass("span3");
                } else {
                    roomspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    workspace.removeClass("span12 span11 span10 span9 span8 span7 span6 span5 span4 span3 span2 span1 span0");
                    roomspace.addClass("span11");
                    workspace.addClass("span0");
                }
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
            this.updateColumnSpans();
        },

        /**
         * @private
         * @param {Event} event
         */
        hearWorkspaceOpened: function(event) {
            this.updateColumnSpans();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(WorkspacePageContainer).with(
        autowired().properties([
            property("workspaceModule").ref("workspaceModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspacePageContainer", WorkspacePageContainer);
});
