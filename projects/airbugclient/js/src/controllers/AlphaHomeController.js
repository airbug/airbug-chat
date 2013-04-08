//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AlphaHomePageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('annotate.Annotate')
//@Require('carapace.ControllerAnnotation')


//TEST
console.log("AlphaHomePageController loaded");

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var ApplicationController = bugpack.require('airbug.ApplicationController');
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

var AlphaHomePageController = Class.extend(ApplicationController, {

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
         * @type {AlphaHomePageContainer}
         */
        this.alphaHomePageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        /*this.userHomePageContainer = new UserHomePageContainer();
        this.setContainerTop(this.userHomePageContainer);*/
    }
});
annotate(AlphaHomePageController).with(
    controller().route("")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AlphaHomePageController", AlphaHomePageController);
