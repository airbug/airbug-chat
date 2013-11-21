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
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @private
         * @type {NavigationModule}
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
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {

    },

    /**
     * @param {RoutingRequest} routingRequest
     * @param {function(Throwable, CurrentUser=)} callback
     */
    requireLogin: function(routingRequest, callback) {
        console.log("ApplicationController#requireLogin");
        var _this       = this;
        var route       = routingRequest.getRoute().route;
        var args        = routingRequest.getArgs();

        this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
            if (!throwable) {
                if (currentUser.isLoggedIn()) {
                    callback(undefined, currentUser);
                } else {
                    _this.navigationModule.setFinalDestination(route.split(/\//)[0] + '/' + args.join("\/"));
                    _this.navigationModule.navigate("login", {
                        trigger: true
                    });
                }
            } else {
                callback(throwable);
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

