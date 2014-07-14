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

//@Export('airbug.EmailSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.EmailSettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerTag')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ApplicationController       = bugpack.require('airbug.ApplicationController');
    var EmailSettingsPageContainer  = bugpack.require('airbug.EmailSettingsPageContainer');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var ControllerTag               = bugpack.require('carapace.ControllerTag');
    var RoutingRequest              = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var controller                  = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var EmailSettingsPageController = Class.extend(ApplicationController, {

        _name: "airbug.EmailSettingsPageController",


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
             * @type {EmailSettingsPageContainer}
             */
            this.emailSettingsPageContainer     = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.emailSettingsPageContainer = new EmailSettingsPageContainer();
            this.setContainerTop(this.emailSettingsPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.emailSettingsPageContainer = null;
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
                    routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(EmailSettingsPageController).with(
        controller().route("settings/email")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.EmailSettingsPageController", EmailSettingsPageController);
});
