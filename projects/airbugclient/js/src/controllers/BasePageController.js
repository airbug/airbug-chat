//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BasePageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
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
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
    var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredAnnotation.autowired;
    var controller              = ControllerAnnotation.controller;
    var property                = PropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var BasePageController = Class.extend(ApplicationController, {

        _name: "airbug.BasePageController",


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

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
                        routingRequest.forward("login", {
                            trigger: true
                        });
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

    bugmeta.annotate(BasePageController).with(
        controller().route("")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BasePageController", BasePageController);
});
