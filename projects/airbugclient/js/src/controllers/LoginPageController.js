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
//@Require('LoginPageEvent')
//@Require('LoginPageNavView')
//@Require('LoginPageView')


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
     * @private
     */
    activate: function() {
        this._super();

        var headerView = new HeaderView();
        var applicationView = new ApplicationView();
        var loginPageView = new LoginPageView();
        var loginPageNavView = new LoginPageNavView();

        headerView.addViewChild(loginPageNavView, '#header-right');
        applicationView.addViewChild(loginPageView, "#application");

        loginPageNavView.addEventListener(LoginPageEvent.EventTypes.NAVIGATE_TO_SIGNUP, this.hearNavigateToSignupEvent, this);

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
    hearNavigateToSignupEvent: function(event) {
        this.navigate("signup", {trigger: true});
    }
});
annotate(LoginPageController).with(
    annotation("Controller").params(
        route("login").to(LoginPageController.prototype.routeLoginPage)
    )
);