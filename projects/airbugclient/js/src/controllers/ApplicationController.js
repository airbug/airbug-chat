//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationController')

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')
//@Require('carapace.CarapaceController')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CarapaceController  = bugpack.require('carapace.CarapaceController');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var autowired           = AutowiredAnnotation.autowired;
var controller          = ControllerAnnotation.controller;
var property            = PropertyAnnotation.property;

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.currentUserManagerModule   = null;

        this.navigationModule           = null;

    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeController: function() {
        this._super();
    },

    /**
     * @Override
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {

    },

    preFilterRouting: function(routingRequest, callback){
        var _this = this;
        var route = routingRequest.getRoute().route;
        var args = routingRequest.getArgs();
        var loggedIn = _this.currentUserManagerModule.userIsLoggedIn(); //false
        this.currentUserManagerModule.retrieveCurrentUser(function(error, currentUser){
            //TODO //BUGBUG //DOUBLE Check this
            var loggedIn = _this.currentUserManagerModule.userIsLoggedIn(); //true //BUGBUG user is not being logged out on the server side
            if(!loggedIn){
                _this.navigationModule.setFinalDestination(route.split(/\//)[0] + '/' + args.join("\/"));
                _this.navigationModule.navigate("login", {
                    trigger: true
                });
            }
            console.log("preFilterRouting: Error:", error, "currentUser:", currentUser, "loggedIn:", loggedIn);
            callback(error, currentUser, loggedIn);
        });
    }

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ApplicationController).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationController", ApplicationController);

