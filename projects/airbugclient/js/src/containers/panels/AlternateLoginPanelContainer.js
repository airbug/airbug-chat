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

//@Export('airbug.AlternateLoginPanelContainer')

//@Require('Class')
//@Require('airbug.GithubLoginButtonContainer')
//@Require('airbug.PanelView')
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
    var GithubLoginButtonContainer      = bugpack.require('airbug.GithubLoginButtonContainer');
    var PanelView                       = bugpack.require('airbug.PanelView');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var AlternateLoginPanelContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.AlternateLoginPanelContainer",


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
             * @type {PanelView}
             */
            this.panelView                      = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {GithubLoginButtonContainer}
             */
            this.githubLoginButtonContainer     = null;
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

            this.panelView =
                view(PanelView)
                    .build();


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.panelView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.githubLoginButtonContainer = new GithubLoginButtonContainer();
            this.addContainerChild(this.githubLoginButtonContainer, "#panel-body-" + this.panelView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AlternateLoginPanelContainer", AlternateLoginPanelContainer);
});
