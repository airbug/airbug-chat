//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('LoginPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.LoginPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ApplicationController   = bugpack.require('airbug.ApplicationController');
var LoginPageContainer      = bugpack.require('airbug.LoginPageContainer');
var BugMeta = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var controller  = ControllerAnnotation.controller;
var property    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
     * @override
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        if(this.currentUserManagerModule.userIsLoggedIn()){
            routingRequest.forward("home");
        } else {
            routingRequest.accept();
        }
    }
});

bugmeta.annotate(LoginPageController).with(
    controller().route("login")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LoginPageController", LoginPageController);
