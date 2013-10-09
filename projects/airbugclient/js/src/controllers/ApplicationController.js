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

var bugmeta             = BugMeta.context();
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

        /**
         * @type {airbug.CurrentManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @type {airbug.NavigationModule}
         */
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
     * @param {carapace.RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {

    },

    /**
     * @param {carapace.RoutingRequest} routingRequest
     * @param {function(error, {*}, boolean)} callback
     */
    preFilterRouting: function(routingRequest, callback){
        var _this       = this;
        var route       = routingRequest.getRoute().route;
        var args        = routingRequest.getArgs();

        this.currentUserManagerModule.retrieveCurrentUser(function(error, currentUser, loggedIn){
            if(!error){
                if(currentUser && loggedIn){
                    callback(error, currentUser, loggedIn);
                } else {
                    _this.navigationModule.setFinalDestination(route.split(/\//)[0] + '/' + args.join("\/"));
                    _this.navigationModule.navigate("login", {
                        trigger: true
                    });
                }
            } else {
                //TODO error handling
                //TODO error tracking
                callback(error, currentUser, loggedIn);
            }
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

