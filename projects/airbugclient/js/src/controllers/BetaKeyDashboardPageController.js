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

//@Export('airbug.BetaKeyDashboardPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.BetaKeyDashboardPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var ApplicationController           = bugpack.require('airbug.ApplicationController');
    var BetaKeyDashboardPageContainer   = bugpack.require('airbug.BetaKeyDashboardPageContainer');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var ControllerTag            = bugpack.require('carapace.ControllerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var controller                      = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var BetaKeyDashboardPageController = Class.extend(ApplicationController, {

        _name: "airbug.BetaKeyDashboardPageController",


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

            /**
             * @protected
             * @type {BetaKeyDashboardPageContainer}
             */
            this.betaKeyDashboardPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.betaKeyDashboardPageContainer = new BetaKeyDashboardPageContainer();
            this.setContainerTop(this.betaKeyDashboardPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.betaKeyDashboardPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            this.requireLogin(routingRequest, function(throwable, currentUser) {
                if (!throwable) {
                    routingRequest.accept();
                } else {
                    //TODO BRN: Figure out how to handle error

                    console.log(throwable.message);
                    console.log(throwable.stack);
                    routingRequest.reject();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BetaKeyDashboardPageController).with(
        controller().route("betakeydashboard")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BetaKeyDashboardPageController", BetaKeyDashboardPageController);
});
