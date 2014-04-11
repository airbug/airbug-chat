//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BetaKeyDashboardPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.BetaKeyDashboardPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var ApplicationController           = bugpack.require('airbug.ApplicationController');
    var BetaKeyDashboardPageContainer   = bugpack.require('airbug.BetaKeyDashboardPageContainer');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
    var ControllerAnnotation            = bugpack.require('carapace.ControllerAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var autowired   = AutowiredAnnotation.autowired;
    var controller  = ControllerAnnotation.controller;
    var property    = PropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var BetaKeyDashboardPageController = Class.extend(ApplicationController, {

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
             * @protected
             * @type {BetaKeyDashboardPageContainer}
             */
            this.betaKeyDashboardPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.betaKeyDashboardPageContainer = new BetaKeyDashboardPageContainer();
            this.setContainerTop(this.betaKeyDashboardPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.betaKeyDashboardPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            this.requireLogin(routingRequest, function(throwable, currentUser) {
                if (!throwable) {
                    routingRequest.accept();
                } else {
                    //TODO BRN: Figure out how to handle error

                    console.log(throwable.message);
                    console.log(throwable.stack);
                    routingRequest.reject();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(BetaKeyDashboardPageController).with(
        controller().route("betakeydashboard")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BetaKeyDashboardPageController", BetaKeyDashboardPageController);
});
