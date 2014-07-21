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

//@Export('airbugserver.AirbugCallController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var LiteralUtil         = bugpack.require('LiteralUtil');
    var EntityController    = bugpack.require('airbugserver.EntityController');
    var ControllerTag       = bugpack.require('bugcontroller.ControllerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var controller          = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var AirbugCallController = Class.extend(EntityController, {

        _name: "airbugserver.AirbugCallController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {AirbugCallService} airbugCallService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, airbugCallService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugCallService}
             */
            this.airbugCallService      = airbugCallService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugCallService}
         */
        getAirbugCallService: function() {
            return this.airbugCallService;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this               = this;
            var expressApp          = this.getExpressApp();
            var airbugCallService   = this.getAirbugCallService();

            // REST API
            //-------------------------------------------------------------------------------

            expressApp.get('/api/v1/airbugcall/:id', function(request, response){
                var requestContext      = request.requestContext;
                var id              = request.params.id;
                airbugCallService.retrieveAirbugCall(requestContext, id, function(throwable, entity){
                    _this.processAjaxRetrieveResponse(response, throwable, entity);
                });
            });

            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveRoom:   function(request, responder, callback) {
                    var data                = request.getData();
                    var id                  = data.objectId;
                    var requestContext      = request.requestContext;

                    airbugCallService.retrieveAirbugCall(requestContext, id, function(throwable, airbugCall) {
                        _this.processRetrieveResponse(responder, throwable, airbugCall, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveRooms: function(request, responder, callback) {
                    var data                = request.getData();
                    var ids                 = data.objectIds;
                    var requestContext      = request.requestContext;

                    airbugCallService.retrieveAirbugCalls(requestContext, ids, function(throwable, airbugCallMap) {
                        _this.processRetrieveEachResponse(responder, throwable, ids, airbugCallMap, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugCallController).with(
        controller("airbugCallController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("airbugCallService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugCallController', AirbugCallController);
});
