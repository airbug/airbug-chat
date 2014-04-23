//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.LoginPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.LoginPageContainer')
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

    var Class                   = bugpack.require('Class');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
    var LoginPageContainer      = bugpack.require('airbug.LoginPageContainer');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
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
    var LoginPageController = Class.extend(ApplicationController, {

        _name: "airbug.LoginPageController'",


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
        // CarapaceController Extensions
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
            var _this = this;
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (!throwable) {
                    if (currentUser && currentUser.isLoggedIn()) {
                        routingRequest.forward("home", {
                            trigger: true
                        });
                    } else {
                        routingRequest.accept();
                    }
                } else {
                    throw throwable;
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(LoginPageController).with(
        controller().route("login")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.LoginPageController", LoginPageController);
});
