//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('LoginFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.FormViewEvent')
//@Require('airbug.LoginFormView')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
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
var LoginFormView           = bugpack.require('airbug.LoginFormView');
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
var property                = PropertyAnnotation.property;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginFormContainer = Class.extend(CarapaceContainer, {

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
         * @type {LoginFormView}
         */
        this.loginFormView       = null;
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

        this.loginFormView =
            view(LoginFormView)
                // .attributes({type: "primary", align: "left"})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.loginFormView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.loginFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
    },

    /**
     * @protected
     */
    activateContainer: function() {
        this._super();
        this.loginFormView.$el.find("input")[0].focus();
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
        this.currentUserManagerModule.loginUser(formData.email, formData.password, function(throwable, currentUser) {
            console.log("Inside LoginFormContainer currentUserManagerModule#loginUser callback");
            console.log("throwable:", throwable, " currentUser:", currentUser, " inside LoginFormContainer");

            if (!throwable) {
                var finalDestination = _this.navigationModule.getFinalDestination();
                console.log("finalDestination:", finalDestination);
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

                var parentContainer     = _this.getContainerParent();
                var notificationView    = parentContainer.getNotificationView();
                if (Class.doesExtend(throwable, Exception)) {
                    notificationView.flashExceptionMessage(throwable.getMessage());
                } else {
                    notificationView.flashErrorMessage("Sorry an error has occurred");
                }
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(LoginFormContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LoginFormContainer", LoginFormContainer);
