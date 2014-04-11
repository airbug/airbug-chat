//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.SessionController')
//@Autoload

//@Require('Class')
//@Require('airbugserver.EntityController')
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

var Class               = bugpack.require('Class');
var EntityController    = bugpack.require('airbugserver.EntityController');
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
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, sessionService, marshaller) {

        this._super(controllerManager, expressApp, bugCallRouter, marshaller);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionService}
         */
        this.sessionService         = sessionService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {SessionService}
     */
    getSessionService: function() {
        return this.sessionService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this       = this;
        var expressApp  = this.getExpressApp();

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SessionController).with(
    module("sessionController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("sessionService"),
            arg().ref("marshaller")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionController', SessionController);
