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

//@Export('airbug.GithubLoginPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.GithubLoginPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ControllerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ApplicationController       = bugpack.require('airbug.ApplicationController');
    var GithubLoginPageContainer    = bugpack.require('airbug.GithubLoginPageContainer');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag         = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag          = bugpack.require('bugioc.PropertyTag');
    var ControllerTag        = bugpack.require('carapace.ControllerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var autowired                   = AutowiredTag.autowired;
    var controller                  = ControllerTag.controller;
    var property                    = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var GithubLoginPageController = Class.extend(ApplicationController, {

        _name: "airbug.GithubLoginPageController",


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
             * @type {GithubLoginPageContainer}
             */
            this.githubLoginPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.githubLoginPageContainer = new GithubLoginPageContainer();
            this.setContainerTop(this.githubLoginPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.githubLoginPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            var _this = this;
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (!throwable) {
                    if (currentUser.isLoggedIn()) {
                        routingRequest.forward("home", {
                            trigger: true
                        });
                    } else {
                        routingRequest.accept();
                    }
                } else {
                    throw throwable;
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(GithubLoginPageController).with(
        controller().route("githubLogin")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginPageController", GithubLoginPageController);
});
