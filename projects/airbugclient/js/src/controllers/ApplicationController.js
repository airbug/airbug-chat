//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationController')

//@Require('Class')
//@Require('annotate.Annotate')
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

var annotate            = Annotate.annotate;
var annotation          = Annotate.annotation;
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
        //TODO
        var route = routingRequest.getRoute().route;
        var args = routingRequest.getArgs();
        console.log("****************************************************");
        console.log("Regex created route:", route.split(/\//)[0] + '/' + args.join("\/"));
        var loggedIn = _this.currentUserManagerModule.userIsLoggedIn(); //false
        this.currentUserManagerModule.getCurrentUser(function(error, currentUser){
            //TODO //BUGBUG
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

annotate(ApplicationController).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("navigationModule").ref("navigationModule")
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationController", ApplicationController);

