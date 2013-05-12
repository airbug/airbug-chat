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
//@Require('carapace.ControllerAnnotation')


//TEST
console.log("SettingsPageController loaded");

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var ApplicationController = bugpack.require('airbug.ApplicationController');
var LoginPageContainer =    bugpack.require('airbug.LoginPageContainer');
var SettingsPageContainer = bugpack.require('airbug.SettingsPageContainer');
var Annotate =              bugpack.require('annotate.Annotate');
var ControllerAnnotation =  bugpack.require('carapace.ControllerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var controller = ControllerAnnotation.controller;


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
    }
});
annotate(SettingsPageController).with(
    controller().route("settings")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPageController", SettingsPageController);
