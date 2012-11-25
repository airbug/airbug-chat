//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactChatPageController')

//@Require('Annotate')
//@Require('ApplicationController')
//@Require('Class')
//@Require('ContactChatPageContainer')
//@Require('ControllerAnnotation')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var controller = ControllerAnnotation.controller;


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
