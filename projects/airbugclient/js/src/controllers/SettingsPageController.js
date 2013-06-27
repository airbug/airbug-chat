//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.LoginPageContainer')
//@Require('airbug.SettingsPageContainer')
//@Require('annotate.Annotate')
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
var SettingsPageContainer   = bugpack.require('airbug.SettingsPageContainer');
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation    = bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var annotation  = Annotate.annotation;
var autowired   = AutowiredAnnotation.autowired;
var controller  = ControllerAnnotation.controller;
var property    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SettingsPageController = Class.extend(ApplicationController, {

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
         * @type {SettingsPageContainer}
         */
        this.settingsPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.settingsPageContainer = new SettingsPageContainer();
        this.setContainerTop(this.settingsPageContainer);
    },

    /**
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        this.super(routingRequest);
    }

});
annotate(SettingsPageController).with(
    controller().route("settings")
);

annotate(SettingsPageController).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPageController", SettingsPageController);
