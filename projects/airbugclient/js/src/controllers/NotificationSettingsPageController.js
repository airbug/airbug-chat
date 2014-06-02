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

//@Export('airbug.NotificationSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.NotificationSettingsPageContainer')
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

    var Class                               = bugpack.require('Class');
    var ApplicationController               = bugpack.require('airbug.ApplicationController');
    var NotificationSettingsPageContainer   = bugpack.require('airbug.NotificationSettingsPageContainer');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ControllerTag                = bugpack.require('carapace.ControllerTag');
    var RoutingRequest                      = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                             = BugMeta.context();
    var controller                          = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var NotificationSettingsPageController = Class.extend(ApplicationController, {

        _name: "airbug.NotificationSettingsPageController",


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
             * @type {NotificationSettingsPageContainer}
             */
            this.notificationSettingsPageContainer      = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.notificationSettingsPageContainer = new NotificationSettingsPageContainer();
            this.setContainerTop(this.notificationSettingsPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.notificationSettingsPageContainer = null;
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

    bugmeta.tag(NotificationSettingsPageController).with(
        controller().route("settings/notification")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NotificationSettingsPageController", NotificationSettingsPageController);
});
