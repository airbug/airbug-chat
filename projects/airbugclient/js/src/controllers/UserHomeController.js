//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomeController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('ContactPanelView')
//@Require('HeaderView')
//@Require('RoomPanelView')
//@Require('UserHomePageNavView')
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

        var contactCollection = new ContactCollection();
        var roomCollection = new RoomCollection();

        var applicationView = new ApplicationView();
        var contactPanelView = new ContactPanelView({
            collection: contactCollection
        });
        var roomPanelView = new RoomPanelView({
            collection: roomCollection
        });
        var headerView = new HeaderView();
        var userHomePageView = new UserHomePageView();
        var userHomePageNavView = new UserHomePageNavView();

        headerView.addViewChild(userHomePageNavView, '#header-right');

        userHomePageView.addViewChild(contactPanelView, "#leftrow");
        userHomePageView.addViewChild(roomPanelView, "#rightrow");
        applicationView.addViewChild(userHomePageView, "#application");

        this.addView(headerView);
        this.addView(applicationView);


        //TEST
        contactCollection.add(new ContactModel({id:1, name: "Tim Pote", status: "away"}));
        contactCollection.add(new ContactModel({id:2, name: "Brian Neisler", status: "available"}));
        contactCollection.add(new ContactModel({id:3, name: "Adam Nisenbaum", status: "dnd"}));
        contactCollection.add(new ContactModel({id:4, name: "Tom Raic", status: "offline"}));

        roomCollection.add(new RoomModel({id:1, name: "airbug Company Room"}));
        roomCollection.add(new RoomModel({id:1, name: "airbug Dev Room"}));


        this.addModel(contactCollection);
        this.addModel(roomCollection);
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
