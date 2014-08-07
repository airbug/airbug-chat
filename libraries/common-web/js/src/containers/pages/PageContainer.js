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

//@Export('airbug.PageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CommandModule')
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
    var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
    var CommandModule               = bugpack.require('airbug.CommandModule');
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
     * @extends {ApplicationContainer}
     */
    var PageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.PageContainer",


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
            this.commandModule              = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {FourColumnView}
             */
            this.fourColumnView             = null;

            /**
             * @private
             * @type {PageView}
             */
            this.pageView                   = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CommandModule}
         */
        getCommandModule: function() {
            return this.commandModule;
        },

        /**
         * @return {FourColumnView}
         */
        getFourColumnView: function() {
            return this.fourColumnView;
        },

        /**
         * @return {PageView}
         */
        getPageView: function() {
            return this.pageView;
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
            this.updateColumnSpans();
        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super(routingArgs);

            // Create Views
            //-------------------------------------------------------------------------------

            view(PageView)
                .name("pageView")
                .children([
                    view(FourColumnView)
                        .name("fourColumnView")
                        .attributes({
                            configuration: FourColumnView.Configuration.ULTRA_THIN_RIGHT_HAMBURGER_LEFT,
                            rowStyle: MultiColumnView.RowStyle.FLUID
                        })
                ])
                .build(this);

            this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand,  this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.TOGGLE.HAMBURGER_LEFT,  this.handleToggleHamburgerLeftCommand, this);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        //TODO BRN: This code really belongs in the View code, not here
        /**
         * @protected
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
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleToggleHamburgerLeftCommand: function(message) {
            var column1   = this.fourColumnView.getColumn1Of4Element();
            column1.toggleClass("hamburger-panel-hidden");
            this.updateColumnSpans();
        },

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleToggleHamburgerRightCommand: function(message) {
            var column4  = this.fourColumnView.getColumn4Of4Element();
            column4.toggleClass("hamburger-panel-hidden");
            this.updateColumnSpans();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(PageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PageContainer", PageContainer);
});
