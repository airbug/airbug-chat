//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.RegistrationPageContainer')
//@Require('annotate.Annotate')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ApplicationController       = bugpack.require('airbug.ApplicationController');
var RegistrationPageContainer   = bugpack.require('airbug.RegistrationPageContainer');
var Annotate                    = bugpack.require('annotate.Annotate');
var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var annotation  = Annotate.annotation;
var controller  = ControllerAnnotation.controller;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RegistrationPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {RegistrationPageContainer}
         */
        this.registrationPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.registrationPageContainer = new RegistrationPageContainer();
        this.setContainerTop(this.registrationPageContainer);
    }
});
annotate(RegistrationPageController).with(
    controller().route("")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationPageController", RegistrationPageController);
