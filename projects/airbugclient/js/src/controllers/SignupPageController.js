//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationController')
//@Require('Class')
//@Require('SignupPageContainer')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {SignupPageContainer}
         */
        this.signupPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.signupPageContainer = new SignupPageContainer(this.apiPublisher);
        this.setContainerTop(this.signupPageContainer);
    }
});
annotate(SignupPageController).with(
    annotation("Controller").params(
        route("signup")
    )
);
