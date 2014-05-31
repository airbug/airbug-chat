/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.SessionController')
//@Autoload

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerAnnotation')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var EntityController        = bugpack.require('airbugserver.EntityController');
    var ControllerAnnotation    = bugpack.require('bugcontroller.ControllerAnnotation');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgAnnotation.arg;
    var bugmeta                 = BugMeta.context();
    var controller              = ControllerAnnotation.controller;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var SessionController = Class.extend(EntityController, {

        _name: "airbugserver.SessionController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {SessionService} sessionService
         * @param {Marshaller} marshaller
         */
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
        controller("sessionController")
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
});
