//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AlphaHomePageController')
//@Autoload

//@Require('Class')
//@Require('airbug.AlphaHomePageContainer')
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

var Class =                     bugpack.require('Class');
var AlphaHomePageContainer =    bugpack.require('airbug.AlphaHomePageContainer');
var ApplicationController =     bugpack.require('airbug.ApplicationController');
var Annotate =                  bugpack.require('annotate.Annotate');
var ControllerAnnotation =      bugpack.require('carapace.ControllerAnnotation');


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
        this.alphaHomePageContainer = new AlphaHomePageContainer();
        this.setContainerTop(this.alphaHomePageContainer);
    },

    /**
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        routingRequest.accept();
    }
});
annotate(AlphaHomePageController).with(
    controller().route("")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AlphaHomePageController", AlphaHomePageController);
