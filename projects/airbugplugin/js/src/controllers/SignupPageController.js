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

//@Export('airbugplugin.SignupPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbugplugin.SignupPageContainer')
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
    var SignupPageContainer     = bugpack.require('airbugplugin.SignupPageContainer');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerTag           = bugpack.require('carapace.ControllerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var controller              = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var SignupPageController = Class.extend(ApplicationController, {

        _name: "airbugplugin.SignupPageController",


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
             * @type {SignupPageContainer}
             */
            this.registrationPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.registrationPageContainer = new SignupPageContainer();
            this.setContainerTop(this.registrationPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.registrationPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            this.getCurrentUserManagerModule().retrieveCurrentUser(function(throwable, currentUser) {
                if (currentUser && currentUser.isLoggedIn()) {
                    routingRequest.forward("home", {
                        trigger: true
                    });
                } else {
                    routingRequest.accept();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SignupPageController).with(
        controller().route("signup")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugplugin.SignupPageController", SignupPageController);
});
