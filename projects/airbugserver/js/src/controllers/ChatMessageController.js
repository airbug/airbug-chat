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

//@Export('airbugserver.ChatMessageController')
//@Autoload

//@Require('Class')
//@Require('Set')
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
    var Set                     = bugpack.require('Set');
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
    var ChatMessageController = Class.extend(EntityController, {

        _name: "airbugserver.ChatMessageController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {ChatMessageService} chatMessageService
         * @param {Marshaller} marshaller
         */
        _constructor: function(controllerManager, expressApp, bugCallRouter, chatMessageService, marshaller) {

            this._super(controllerManager, expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageService}
             */
            this.chatMessageService     = chatMessageService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {ChatMessageService}
         */
        getChatMessageService: function() {
            return this.chatMessageService;
        },


        //-------------------------------------------------------------------------------
        // Controller Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this               = this;
            var expressApp          = this.getExpressApp();
            var chatMessageService  = this.getChatMessageService();

            // REST API
            //-------------------------------------------------------------------------------

            expressApp.get('/api/v1/chatmessage/:id', function(request, response) {
                var requestContext      = request.requestContext;
                var chatMessageId       = request.params.id;
                chatMessageService.retrieveChatMessage(requestContext, chatMessageId, function(throwable, entity) {
                     _this.processAjaxRetrieveResponse(response, throwable, entity);
                });
            });

            expressApp.post('/api/v1/chatmessage', function(request, response) {
                var requestContext      = request.requestContext;
                var chatMessage         = request.body;
                chatMessageService.createChatMessage(requestContext, chatMessage, function(throwable, entity) {
                    _this.processAjaxCreateResponse(response, throwable, entity);
                });
            });

            expressApp.put('/api/v1/chatmessage/:id', function(request, response) {
                var requestContext  = request.requestContext;
                var chatMessageId   = request.params.id;
                var updates         = request.body;
                chatMessageService.updateChatMessage(requestContext, chatMessageId, updates, function(throwable, entity) {
                    _this.processAjaxUpdateResponse(response, throwable, entity);
                });
            });

            expressApp.delete('/api/v1/chatmessage/:id', function(request, response) {
                var _this = this;
                var requestContext  = request.requestContext;
                var chatMessageId   = request.params.id;
                chatMessageService.deleteChatMessage(requestContext, chatMessageId, function(throwable, entity) {
                    _this.processAjaxDeleteResponse(response, throwable, entity);
                });
            });

            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                createChatMessage: function(request, responder, callback) {
                    var data                = request.getData();
                    var chatMessageObject   = data.object;
                    var requestContext      = request.requestContext;

                    chatMessageService.createChatMessage(requestContext, chatMessageObject, function(throwable, chatMessage) {
                        _this.processCreateResponse(responder, throwable, chatMessage, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveChatMessage: function(request, responder, callback) {
                    var data                = request.getData();
                    var chatMessageId       = data.objectId;
                    var requestContext      = request.requestContext;

                    chatMessageService.retrieveChatMessage(requestContext, chatMessageId, function(throwable, chatMessage) {
                        _this.processRetrieveResponse(responder, throwable, chatMessage, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveChatMessages: function(request, responder, callback) {
                    var data                = request.getData();
                    var chatMessageIds      = data.objectIds;
                    var requestContext      = request.requestContext;

                    chatMessageService.retrieveChatMessages(requestContext, chatMessageIds, function(throwable, chatMessageMap) {
                        _this.processRetrieveEachResponse(responder, throwable, chatMessageIds, chatMessageMap, callback);
                    });
                },

                retrieveChatMessageBatchByConversationId: function(request, responder, callback) {
                    console.log("ChatMessageController#retrieveChatMessageBatchByConversationId");
                    var data                = request.getData();
                    var conversationId      = data.conversationId;
                    var index               = data.index;
                    var batchSize           = data.batchSize;
                    var order               = data.order; //asc vs. desc
                    var requestContext      = request.requestContext;

                    console.log("conversationId:", conversationId, "index:", index, "batchSize:", batchSize, "order", order);
                    chatMessageService.retrieveChatMessageBatchByConversationId(requestContext, conversationId, index, batchSize, order, function(throwable, chatMessageList) {
                        _this.processRetrieveListResponse(responder, throwable, chatMessageList, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveChatMessagesByConversationIdSortBySentAt: function(request, responder, callback) {
                    var data                = request.getData();
                    var conversationId      = data.conversationId;
                    var requestContext      = request.requestContext;

                    chatMessageService.retrieveChatMessagesByConversationIdSortBySentAt(requestContext, conversationId, function(throwable, chatMessageList) {
                        _this.processRetrieveListResponse(responder, throwable, chatMessageList, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ChatMessageController).with(
        controller("chatMessageController")
            .args([
                arg().ref("controllerManager"),
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("chatMessageService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
});
