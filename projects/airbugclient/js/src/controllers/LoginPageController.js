//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('Class')
//@Require('Controller')
//@Require('HeaderView')
//@Require('LoginPageView')
//@Require('LoginPageNavView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageController = Class.extend(Controller, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


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
        var loginPageView = new LoginPageView();
        var loginPageNavView = new LoginPageNavView();

        headerView.addViewChild('#header-right', loginPageNavView);
        applicationView.addViewChild("#application", loginPageView);

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
    }
});
annotate(HomeController).with(
    annotation("Controller").params(
        route("/login").to(LoginPageController.prototype.routeHome)
    )
);