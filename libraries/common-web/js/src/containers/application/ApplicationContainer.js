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

//@Export('airbug.ApplicationContainer')

//@Require('Class')
//@Require('airbug.ErrorNotificationOverlayContainer')
//@Require('airbug.NotificationContainer')
//@Require('carapace.ApplicationHeaderView')
//@Require('carapace.ApplicationView')
//@Require('carapace.BodyView')
//@Require('carapace.CarapaceContainer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ErrorNotificationOverlayContainer   = bugpack.require('airbug.ErrorNotificationOverlayContainer');
    var NotificationContainer               = bugpack.require('airbug.NotificationContainer');
    var ApplicationHeaderView               = bugpack.require('carapace.ApplicationHeaderView');
    var ApplicationView                     = bugpack.require('carapace.ApplicationView');
    var BodyView                            = bugpack.require('carapace.BodyView');
    var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ApplicationContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ApplicationContainer",


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
             * @type {ApplicationHeaderView}
             */
            this.applicationHeaderView  = null;

            /**
             * @private
             * @type {ApplicationView}
             */
            this.applicationView        = null;

            /**
             * @private
             * @type {BodyView}
             */
            this.bodyView               = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {NotificationContainer}
             */
            this.notificationContainer  = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * return {ApplicationHeaderView}
         */
        getApplicationHeaderView: function() {
            return this.applicationHeaderView;
        },

        /**
         * @return {ApplicationView}
         */
        getApplicationView: function() {
            return this.applicationView;
        },

        /**
         * @return {BodyView}
         */
        getBodyView: function() {
            return this.bodyView;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         */
        create: function(routingArgs) {
            if (!this.created) {
                this.created = true;
                this.createApplication(routingArgs);
                this.initializeApplication();
            }
        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            this.applicationHeaderView  = new ApplicationHeaderView();
            this.applicationView        = new ApplicationView({id: "application"});

            this.bodyView.addViewChild(this.applicationView);

            this.applicationView.addViewChild(this.applicationHeaderView, "#application-header-{{cid}}");
            this.setViewTop(this.bodyView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.notificationContainer = new NotificationContainer();
            this.addContainerChild(this.notificationContainer, "#application-" + this.applicationView.getCid());
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        createApplication: function(routingArgs) {
            this.bodyView = new BodyView();
            this.bodyView.create();
            this.bodyView.hide();
            this.createContainer(routingArgs);
            this.createContainerChildren(routingArgs);
            this.bodyView.show();
        },

        /**
         * @private
         */
        initializeApplication: function() {
            this.initializeContainer();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ApplicationContainer", ApplicationContainer);
});
