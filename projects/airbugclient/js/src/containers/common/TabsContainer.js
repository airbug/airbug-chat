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

//@Export('airbug.TabsContainer')

//@Require('Class')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.TabView')
//@Require('carapace.TabsView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var CarapaceContainer   = bugpack.require('carapace.CarapaceContainer');
    var TabView             = bugpack.require('carapace.TabView');
    var TabsView            = bugpack.require('carapace.TabsView');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var TabsContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.TabsContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Array.<{container: CarapaceContainer, text: string}>} tabs
         */
        _constructor: function(tabs) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<{container: CarapaceContainer, text: string}>}
             */
            this.tabs           = tabs;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {TabsView}
             */
            this.tabsView       = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            $(this.getViewTop().getId()).tabs();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Views
            //-------------------------------------------------------------------------------

            view(TabsView)
                .name("tabsView")
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.tabsView);

        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();

            var _this = this;
            this.tabs.forEach(function(tab){
                _this.addContainerChild(tab.container);
                var tabView = view(TabView)
                    .attributes({
                        href: tab.container.getViewTop().getId(),
                        text: tab.text
                    })
                    .build();
                _this.getViewTop().addViewChild(tabView, "ul");
            });
        }
    });

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.TabsContainer", TabsContainer);
});
