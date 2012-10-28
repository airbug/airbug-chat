//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('HeaderView')
//@Require('LoginPageView')
//@Require('SignupButtonEvent')
//@Require('SignupButtonView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activate: function() {
        this._super();

        var headerView = new HeaderView();
        var applicationView = new ApplicationView();
        var loginPageView = new LoginPageView();
        var signupButtonView = new SignupButtonView();

        headerView.addViewChild(signupButtonView, '#header-right');
        applicationView.addViewChild(loginPageView, "#application");

        signupButtonView.addEventListener(SignupButtonEvent.EventTypes.CLICKED, this.hearSignupButtonClickedEvent, this);

        this.addView(headerView);
        this.addView(applicationView);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeLoginPage: function() {
        // Is there anything we need to do here?
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearSignupButtonClickedEvent: function(event) {
        this.navigate("signup", {trigger: true});
    }
});
annotate(LoginPageController).with(
    annotation("Controller").params(
        route("login").to(LoginPageController.prototype.routeLoginPage)
    )
);