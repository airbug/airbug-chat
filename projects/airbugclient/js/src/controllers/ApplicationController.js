//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ApplicationController')

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')
//@Require('carapace.CarapaceController')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
    var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');
    var CarapaceController          = bugpack.require('carapace.CarapaceController');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var autowired                   = AutowiredAnnotation.autowired;
    var controller                  = ControllerAnnotation.controller;
    var property                    = PropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceController}
     */
    var ApplicationController = Class.extend(CarapaceController, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @Override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {

        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {RoutingRequest} routingRequest
         * @param {function(Throwable, CurrentUser=)} callback
         */
        requireLogin: function(routingRequest, callback) {
            var _this       = this;
            var route       = routingRequest.getRoute().route;
            var args        = routingRequest.getArgs();

            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (!throwable) {
                    if (currentUser.isLoggedIn()) {
                        callback(null, currentUser);
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
});
