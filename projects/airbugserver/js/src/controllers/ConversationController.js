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

//@Export('airbugserver.ConversationController')
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

    var Class                   = bugpack.require('Class');
    var LiteralUtil             = bugpack.require('LiteralUtil');
    var EntityController        = bugpack.require('airbugserver.EntityController');
    var ControllerTag    = bugpack.require('bugcontroller.ControllerTag');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var controller              = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var ConversationController = Class.extend(EntityController, {

        _name: "airbugserver.ConversationController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {ConversationService} conversationService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, conversationService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ConversationService}
             */
            this.conversationService    = conversationService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ConversationService}
         */
        getConversationService: function() {
            return this.conversationService;
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
            var conversationService = this.getConversationService();

            // REST API
            //-------------------------------------------------------------------------------

            expressApp.get('/api/v1/conversation/:id', function(request, response) {
                var requestContext      = request.requestContext;
                var conversationId      = request.params.id;
                conversationService.retrieveConversation(requestContext, conversationId, function(throwable, entity) {
                    _this.processAjaxRetrieveResponse(response, throwable, entity);
                });
            });

            expressApp.post('/api/v1/conversation', function(request, response) {
                var requestContext      = request.requestContext;
                var conversation        = request.body;
                conversationService.createConversation(requestContext, conversation, function(throwable, entity) {
                    _this.processAjaxCreateResponse(response, throwable, entity);
                });
            });

            expressApp.put('/api/conversation/:id', function(request, response) {
                var requestContext  = request.requestContext;
                var conversationId          = request.params.id;
                var updates         = request.body;
                conversationService.updateConversation(requestContext, conversationId, updates, function(throwable, entity) {
                    _this.processAjaxUpdateResponse(response, throwable, entity);
                });
            });

            expressApp.delete('/api/conversation/:id', function(request, response) {
                var _this = this;
                var requestContext  = request.requestContext;
                var conversationId  = request.params.id;
                conversationService.deleteConversation(requestContext, conversationId, function(throwable) {
                    _this.processAjaxDeleteResponse(response, throwable, entity);
                });
            });

            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveConversation: function(request, responder, callback) {
                    var data                = request.getData();
                    var conversationId      = data.objectId;
                    var requestContext      = request.requestContext;

                    conversationService.retrieveConversation(requestContext, conversationId, function(throwable, conversation) {
                        _this.processRetrieveResponse(responder, throwable, conversation, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveConversationChatMessageStream: function(request, responder, callback) {
                    var data                = request.getData();
                    var conversationId      = data.objectId;
                    var requestContext      = request.requestContext;

                    conversationService.retrieveConversationChatMessageStream(requestContext, conversationId, function(throwable) {
                        _this.processRetrieveResponse(responder, throwable, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ConversationController).with(
        controller("conversationController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("conversationService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ConversationController', ConversationController);
});
