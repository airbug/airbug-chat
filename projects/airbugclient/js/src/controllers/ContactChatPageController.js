//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactChatPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.ContactChatPageContainer')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var ContactChatPageContainer    = bugpack.require('airbug.ContactChatPageContainer');
var Annotate                    = bugpack.require('annotate.Annotate');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var annotation  = Annotate.annotation;
var autowired   = AutowiredAnnotation.autowired;
var controller  = ControllerAnnotation.controller;
var property    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactChatPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactChatPageContainer}
         */
        this.contactChatPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.contactChatPageContainer = new ContactChatPageContainer();
        this.setContainerTop(this.contactChatPageContainer);
    }
});
annotate(ContactChatPageController).with(
    controller().route("contact/:uuid")
);

annotate(ContactChatPageController).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactChatPageController", ContactChatPageController);
