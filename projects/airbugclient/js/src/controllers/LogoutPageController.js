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

//@Export('airbug.LogoutPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.LoginPageContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
    var LoginPageContainer      = bugpack.require('airbug.LoginPageContainer');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerTag           = bugpack.require('carapace.ControllerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredTag.autowired;
    var controller              = ControllerTag.controller;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var LogoutPageController = Class.extend(ApplicationController, {

        _name: "airbug.LogoutPageController",


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
             * @type {LoginPageContainer}
             */
            this.loginPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.loginPageContainer = new LoginPageContainer();
            this.setContainerTop(this.loginPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.loginPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (currentUser.isLoggedIn()) {
                    routingRequest.reject();
                } else {
                    routingRequest.accept();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(LogoutPageController).with(
        controller().route("loggedout")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.LogoutPageController", LogoutPageController);
});
