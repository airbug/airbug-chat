//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.LogoutPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.LoginPageContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
    var LoginPageContainer      = bugpack.require('airbug.LoginPageContainer');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


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
    var LogoutPageController = Class.extend(ApplicationController, {

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
             * @type {LoginPageContainer}
             */
            this.loginPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.loginPageContainer = new LoginPageContainer();
            this.setContainerTop(this.loginPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.loginPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (currentUser.isLoggedIn()) {
                    routingRequest.reject();
                } else {
                    routingRequest.accept();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(LogoutPageController).with(
        controller().route("loggedout")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.LogoutPageController", LogoutPageController);
});
