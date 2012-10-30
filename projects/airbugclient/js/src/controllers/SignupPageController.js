//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('ButtonViewEvent')
//@Require('CarapaceController')
//@Require('Class')
//@Require('HeaderView')
//@Require('LoginButtonView')
//@Require('SignupPageView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupPageController = Class.extend(CarapaceController, {

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
        var signupPageView = new SignupPageView();
        var loginButtonView = new LoginButtonView();

        headerView.addViewChild(loginButtonView, '#header-right');
        applicationView.addViewChild(signupPageView, "#application");

        loginButtonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearLoginButtonClickedEvent, this);

        this.addView(headerView);
        this.addView(applicationView);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeSignup: function() {
        // Is there anything we need to do here?
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearLoginButtonClickedEvent: function(event) {
        this.navigate("login", {trigger: true});
    }
});
annotate(SignupPageController).with(
    annotation("Controller").params(
        route("signup").to(SignupPageController.prototype.routeSignup)
    )
);
