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

//@Export('airbugserver.BetaKeyController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerAnnotation')
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
    var LiteralUtil             = bugpack.require('LiteralUtil');
    var EntityController        = bugpack.require('airbugserver.EntityController');
    var ControllerAnnotation    = bugpack.require('bugcontroller.ControllerAnnotation');
    var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgAnnotation.arg;
    var bugmeta                 = BugMeta.context();
    var controller              = ControllerAnnotation.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var BetaKeyController = Class.extend(EntityController, {

        _name: "airbugserver.BetaKeyController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {BetaKeyService} betaKeyService
         * @param {Marshaller} marshaller
         */
        _constructor: function(controllerManager, expressApp, bugCallRouter, betaKeyService, marshaller) {

            this._super(controllerManager, expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BetaKeyService}
             */
            this.betaKeyService      = betaKeyService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BetaKeyService}
         */
        getBetaKeyService: function() {
            return this.betaKeyService;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this                   = this;
            var expressApp              = this.getExpressApp();
            var betaKeyService          = this.getBetaKeyService();

            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveBetaKey:   function(request, responder, callback) {
                    var data                = request.getData();
                    var betaKey             = data.betaKey;
                    var requestContext      = request.requestContext;

                    if(betaKey === "ALL_THE_BUGS_SPECIAL_COMBO") {
                        betaKeyService.retrieveAllBetaKeys(requestContext, function(throwable, betaKeyList) {
                            _this.processRetrieveListResponse(responder, throwable, betaKeyList, callback);
                        });
                    } else {
                        betaKeyService.retrieveBetaKeyByBetaKey(requestContext, betaKey, function(throwable, betaKey) {
                            _this.processRetrieveResponse(responder, throwable, betaKey, callback);
                        });
                    }
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(BetaKeyController).with(
        controller("betaKeyController")
            .args([
                arg().ref("controllerManager"),
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("betaKeyService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.BetaKeyController', BetaKeyController);
});
