//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.NotificationContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.NotificationView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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

    var Class                       = bugpack.require('Class');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var NotificationView            = bugpack.require('airbug.NotificationView');
    var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer')
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired   = AutowiredAnnotation.autowired;
    var bugmeta     = BugMeta.context();
    var CommandType = CommandModule.CommandType;
    var property    = PropertyAnnotation.property;
    var view        = ViewBuilder.view;


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

    bugmeta.annotate(NotificationContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NotificationContainer", NotificationContainer);
});
