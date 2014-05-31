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

//@Export('airbugserver.InteractionStatusController')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
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
    var Exception               = bugpack.require('Exception');
    var LiteralUtil             = bugpack.require('LiteralUtil');
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
    var InteractionStatusController = Class.extend(EntityController, {

        _name: "airbugserver.InteractionStatusController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {InteractionStatusService} interactionStatusService
         * @param {Marshaller} marshaller
         */
        _constructor: function(controllerManager, expressApp, bugCallRouter, interactionStatusService, marshaller) {

            this._super(controllerManager, expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {InteractionStatusService}
             */
            this.interactionStatusService       = interactionStatusService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {InteractionStatusService}
         */
        getInteractionStatusService: function() {
            return this.interactionStatusService;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this                       = this;
            var interactionStatusService    = this.getInteractionStatusService();


            //-------------------------------------------------------------------------------
            // BugCall Routes
            //-------------------------------------------------------------------------------

            this.getBugCallRouter().addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                setInteractionStatus: function(request, responder, callback) {
                    var data                = request.getData();
                    var interactionStatus   = data.interactionStatus;
                    var requestContext      = request.requestContext;
                    interactionStatusService.setInteractionStatus(requestContext, interactionStatus, function(throwable) {
                        _this.processResponse(responder, throwable, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(InteractionStatusController).with(
        controller("interactionStatusController")
            .args([
                arg().ref("controllerManager"),
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("interactionStatusService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.InteractionStatusController', InteractionStatusController);
});
