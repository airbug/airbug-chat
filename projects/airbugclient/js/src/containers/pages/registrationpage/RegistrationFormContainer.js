//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.CommandModule')
//@Require('airbug.RegistrationFormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.RoomModel')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var CommandModule           = bugpack.require('airbug.CommandModule');
var RegistrationFormView    = bugpack.require('airbug.RegistrationFormView');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var RoomModel               = bugpack.require('airbug.RoomModel');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var autowired               = AutowiredAnnotation.autowired;
var CommandType             = CommandModule.CommandType;
var property                = PropertyAnnotation.property;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RegistrationFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule           = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RegistrationFormView}
         */
        this.registrationFormView       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.registrationFormView =
            view(RegistrationFormView)
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.registrationFormView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.registrationFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.registrationFormView.$el.find("input[name='email']").focus();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearFormSubmittedEvent: function(event) {
        var _this       = this;
        var formData    = event.getData().formData;

        console.log("Inside RegistrationFormContainer#hearFormSubmittedEvent");

        this.currentUserManagerModule.registerUser(formData, function(throwable, currentUserMeldDocument) {
            if (!throwable) {
                var finalDestination = _this.navigationModule.getFinalDestination();
                if (finalDestination) {
                    _this.navigationModule.clearFinalDestination();
                    _this.navigationModule.navigate(finalDestination, {
                        trigger: true
                    });
                } else {
                    _this.navigationModule.navigate("home", {
                        trigger: true
                    });
                }
            } else {

                //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                if (Class.doesExtend(throwable, Exception)) {
                    _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                } else {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                }
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RegistrationFormContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("navigationModule").ref("navigationModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationFormContainer", RegistrationFormContainer);
