//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationFormContainer')

//@Require('Class')
//@Require('airbug.RegistrationFormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.RoomModel')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var RegistrationFormView    = bugpack.require('airbug.RegistrationFormView');
var FormViewEvent           = bugpack.require('airbug.FormViewEvent');
var RoomModel               = bugpack.require('airbug.RoomModel');
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


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
                // .attributes({type: "primary", align: "left"})
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


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearFormSubmittedEvent: function(event) {
        var _this       = this;
        var userObj     = event.getData();
        this.navigationModule;
        this.currentUserManagerModule.establishCurrentUser(userObj, function(error, currentUser){
            if(!error){
                //TODO
                _this.navigationModule.navigate("home", {
                    trigger: true
                });
            } else {
                //TODO
                console.log("currentUserManagerModule#createRoom callback error:", error);
            }
        });
    }
});
annotate(RegistrationFormContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationFormContainer", RegistrationFormContainer);
