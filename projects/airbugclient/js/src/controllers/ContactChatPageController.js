//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactChatPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationController')
//@Require('Class')
//@Require('ContactChatPageContainer')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


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
    annotation("Controller").params(
        route("contact/:uuid")
    )
);
