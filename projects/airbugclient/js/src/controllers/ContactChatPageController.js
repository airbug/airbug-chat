//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactChatPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.ContactChatPageContainer')
//@Require('bugmeta.BugMeta')
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
var BugMeta = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
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
    },

    /**
     * @override
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        this.preFilterRouting(routingRequest, function(error, currentUser, loggedIn){
            if(!loggedIn){
                routingRequest.forward("");
            } else {
                routingRequest.accept();
            }
        });
    }
});
bugmeta.annotate(ContactChatPageController).with(
    controller().route("contact/:uuid")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactChatPageController", ContactChatPageController);
