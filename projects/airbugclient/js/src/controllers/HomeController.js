//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('Class')
//@Require('Controller')
//@Require('HeaderView')
//@Require('SignupPageView')
//@Require('SignupPageNavView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomeController = Class.extend(Controller, {

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
    // Controller Implementation
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    activate: function() {
        this._super();

        var headerView = new HeaderView();
        var applicationView = new ApplicationView();
        var signupPageView = new SignupPageView();
        var signupPageNavView = new SignupPageNavView();

        headerView.addViewChild('#header-right', signupPageNavView);
        applicationView.addViewChild("#application", signupPageView);

        signupPageNavView.addEventListener(SignupPageNavView.EventTypes.NAVIGATE_TO_LOGIN, this.hearNavigateToLoginEvent, this);

        this.addView(headerView);
        this.addView(applicationView);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeHome: function() {
        // Is there anything we need to do here?
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearNavigateToLoginEvent: function(event) {
        this.navigate("login", {trigger: true});
    }
});
annotate(HomeController).with(
    annotation("Controller").params(
        route("").to(HomeController.prototype.routeHome)
    )
);