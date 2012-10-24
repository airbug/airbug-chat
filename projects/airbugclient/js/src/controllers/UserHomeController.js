//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomeController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('ContactsPanelView')
//@Require('HeaderView')
//@Require('UserHomePageView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserHomeController = Class.extend(CarapaceController, {

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

        var applicationView = new ApplicationView();
        var contactsPanelView = new ContactsPanelView();
        var headerView = new HeaderView();
        var userHomePageView = new UserHomePageView();

        userHomePageView.addViewChild("#leftrow", contactsPanelView);
        applicationView.addViewChild("#application", userHomePageView);

        this.addView(headerView);
        this.addView(applicationView);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeUserHome: function() {
        // Is there anything we need to do here?
    }


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

});
annotate(UserHomeController).with(
    annotation("Controller").params(
        route("").to(UserHomeController.prototype.routeUserHome)
    )
);
