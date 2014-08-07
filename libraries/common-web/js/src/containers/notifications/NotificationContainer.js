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

//@Export('airbug.NotificationContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.NotificationView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var CommandModule       = bugpack.require('airbug.CommandModule');
    var NotificationView    = bugpack.require('airbug.NotificationView');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer   = bugpack.require('carapace.CarapaceContainer')
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired           = AutowiredTag.autowired;
    var bugmeta             = BugMeta.context();
    var CommandType         = CommandModule.CommandType;
    var property            = PropertyTag.property;
    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var NotificationContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.NotificationContainer",


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
             * @type {CommandModule}
             */
            this.commandModule      = null;

            // Containers
            //-------------------------------------------------------------------------------


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {NotificationView}
             */
            this.notificationView   = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super(routingArgs);

            // Create Views
            //-------------------------------------------------------------------------------

            this.notificationView =
                view(NotificationView)
                    .build();

            this.setViewTop(this.notificationView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.FLASH.ERROR,     this.handleFlashErrorCommand,       this);
            this.commandModule.unsubscribe(CommandType.FLASH.EXCEPTION, this.handleFlashExceptionCommand,   this);
            this.commandModule.unsubscribe(CommandType.FLASH.MESSAGE,   this.handleFlashMessageCommand,     this);
            this.commandModule.unsubscribe(CommandType.FLASH.SUCCESS,   this.handleFlashSuccessCommand,     this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.FLASH.ERROR,       this.handleFlashErrorCommand,       this);
            this.commandModule.subscribe(CommandType.FLASH.EXCEPTION,   this.handleFlashExceptionCommand,   this);
            this.commandModule.subscribe(CommandType.FLASH.MESSAGE,     this.handleFlashMessageCommand,     this);
            this.commandModule.subscribe(CommandType.FLASH.SUCCESS,     this.handleFlashSuccessCommand,     this);
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} publisherMessage
         */
        handleFlashErrorCommand: function(publisherMessage){
            var data    = publisherMessage.getData();
            var message = data.message;
            var delay   = data.delay;
            this.notificationView.flashErrorMessage(message, delay);
        },

        /**
         * @private
         * @param {PublisherMessage} publisherMessage
         */
        handleFlashExceptionCommand: function(publisherMessage){
            var data    = publisherMessage.getData();
            var message = data.message;
            var delay   = data.delay;
            this.notificationView.flashExceptionMessage(message, delay);
        },

        /**
         * @private
         * @param {PublisherMessage} publisherMessage
         */
        handleFlashMessageCommand: function(publisherMessage){
            var data    = publisherMessage.getData();
            var message = data.message;
            var delay   = data.delay;
            this.notificationView.flashMessage(message, delay);
        },

        /**
         * @private
         * @param {PublisherMessage} publisherMessage
         */
        handleFlashSuccessCommand: function(publisherMessage){
            var data    = publisherMessage.getData();
            var message = data.message;
            var delay   = data.delay;
            this.notificationView.flashSuccessMessage(message, delay);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(NotificationContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NotificationContainer", NotificationContainer);
});
