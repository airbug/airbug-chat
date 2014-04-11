//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.Controller')

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.IProcessModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var IProcessModule      = bugpack.require('bugioc.IProcessModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Controller = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ControllerManager} controllerManager
     * @param {ExpressApp} expressApp
     */
    _constructor: function(controllerManager, expressApp) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.configured                 = false;

        /**
         * @private
         * @type {ControllerManager}
         */
        this.controllerManager          = controllerManager;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp                 = expressApp;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isConfigured: function() {
        return this.configured;
    },

    /**
     * @return {ControllerManager}
     */
    getControllerManager: function() {
        return this.controllerManager;
    },

    /**
     * @return {ExpressApp}
     */
    getExpressApp: function() {
        return this.expressApp;
    },


    //-------------------------------------------------------------------------------
    // IProcessModule Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    processModule: function() {
        this.controllerManager.registerController(this);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configure: function(callback) {
        if (!this.isConfigured()) {
            this.configureController(callback);
        } else {
            callback();
        }
    },

    /**
     * @param {function(Throwable=)} callback
     */
    unconfigure: function(callback) {
        if (this.isConfigured()) {
            this.unconfigureController(callback);
        } else {
            callback();
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    unconfigureController: function(callback) {
        callback();
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(Controller, IProcessModule);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Controller', Controller);
