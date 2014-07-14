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

//@Export('airbugserver.ChatMessageStreamController')
//@Autoload

//@Require('Class')
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
    var ChatMessageStreamController = Class.extend(EntityController, {

        _name: "airbugserver.ChatMessageStreamController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {ChatMessageStreamService} chatMessageStreamService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, chatMessageStreamService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageStreamService}
             */
            this.chatMessageStreamService   = chatMessageStreamService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ChatMessageStreamService}
         */
        getChatMessageStreamService: function() {
            return this.chatMessageStreamService;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this                       = this;
            var expressApp                  = this.getExpressApp();
            var chatMessageStreamService    = this.getChatMessageStreamService();

            // REST API
            //-------------------------------------------------------------------------------

            expressApp.get('/api/v1/chatmessagestream/:id', function(request, response) {
                var requestContext      = request.requestContext;
                var entityId            = request.params.id;
                chatMessageStreamService.retrieveChatMessageStream(requestContext, entityId, function(throwable, entity) {
                    _this.processAjaxRetrieveResponse(response, throwable, entity);
                });
            });

            expressApp.post('/api/v1/chatmessagestream', function(request, response) {
                var requestContext      = request.requestContext;
                var entityData          = request.body;
                chatMessageStreamService.createChatMessageStream(requestContext, entityData, function(throwable, entity) {
                    _this.processAjaxCreateResponse(response, throwable, entity);
                });
            });

            expressApp.put('/api/v1/chatmessagestream/:id', function(request, response) {
                var requestContext  = request.requestContext;
                var entityId        = request.params.id;
                var updates         = request.body;
                chatMessageStreamService.updateChatMessageStream(requestContext, entityId, updates, function(throwable, entity) {
                    _this.processAjaxUpdateResponse(response, throwable, entity);
                });
            });

            expressApp.delete('/api/v1/chatmessagestream/:id', function(request, response) {
                var _this = this;
                var requestContext  = request.requestContext;
                var entityId        = request.params.id;
                chatMessageStreamService.deleteChatMessageStream(requestContext, entityId, function(throwable, entity) {
                    _this.processAjaxDeleteResponse(response, throwable, entity);
                });
            });

            this.getBugCallRouter().addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveChatMessageStream: function(request, responder, callback) {
                    var data                = request.getData();
                    var chatMessageStreamId = data.objectId;
                    var requestContext      = request.requestContext;

                    chatMessageStreamService.retrieveChatMessageStream(requestContext, chatMessageStreamId, function(throwable, chatMessageStream) {
                        _this.processRetrieveResponse(responder, throwable, chatMessageStream, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageStreamController).with(
        controller("chatMessageStreamController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("chatMessageStreamService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageStreamController', ChatMessageStreamController);
});
