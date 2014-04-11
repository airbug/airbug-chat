//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChangePasswordFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.ChangePasswordFormView')
//@Require('airbug.CommandModule')
//@Require('airbug.FormViewEvent')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Exception                       = bugpack.require('Exception');
var ChangePasswordFormView          = bugpack.require('airbug.ChangePasswordFormView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var FormViewEvent                   = bugpack.require('airbug.FormViewEvent');
var RoomModel                       = bugpack.require('airbug.RoomModel');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredAnnotation.autowired;
var CommandType                     = CommandModule.CommandType;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {CarapaceContainer}
 */
var ChangePasswordFormContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(currentUserModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserModel}
         */
        this.currentUserModel           = currentUserModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule           = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChangePasswordFormView}
         */
        this.changePasswordFormView     = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.changePasswordFormView.$el.find("input")[0].focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(ChangePasswordFormView)
            .name("changePasswordFormView")
            .model(this.currentUserModel)
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.changePasswordFormView);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.changePasswordFormView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.changePasswordFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
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
        this.userManagerModule.updateUserPassword(this.currentUserModel.getProperty("id"), formData, function(throwable, currentUser) {
            if (!throwable) {
                _this.changePasswordFormView.clearForm();
                _this.commandModule.relayCommand(CommandType.FLASH.SUCCESS, {message: "Password was successfully changed"});
            } else {
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

bugmeta.annotate(ChangePasswordFormContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("navigationModule").ref("navigationModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChangePasswordFormContainer", ChangePasswordFormContainer);
