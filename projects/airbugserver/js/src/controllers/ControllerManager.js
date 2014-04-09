//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ControllerManager')
//@Autoload

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.Controller')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ArgumentBug         = bugpack.require('ArgumentBug');
var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var Controller          = bugpack.require('airbugserver.Controller');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;
var $iterableParallel   = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ControllerManager = Class.extend(Obj, {


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
         * @type {Set.<Controller>}
         */
        this.registeredControlerSet = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Set.<Controller>}
     */
    getRegisteredControllerSet: function() {
        return this.registeredControlerSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    initialize: function(callback) {
        //TEST
        console.log("Initializing ControllerManager");

        $iterableParallel(this.registeredControlerSet, function(flow, controller) {
            controller.configure(function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @param {Controller} controller
     */
    registerController: function(controller) {
        if (Class.doesExtend(controller, Controller)) {
            this.registeredControlerSet.add(controller);
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "controller", controller, "parameter must extend Controller");
        }
    }

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ControllerManager).with(
    module("controllerManager")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ControllerManager', ControllerManager);
