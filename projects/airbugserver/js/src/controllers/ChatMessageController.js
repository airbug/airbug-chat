//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
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
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, chatMessageService) {

        this._super(controllerManager, expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Declare Variables
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
                var chatMessageJson = null;
                if (entity) {
                    chatMessageJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        expressApp.post('/api/v1/chatmessage', function(request, response) {
            var requestContext      = request.requestContext;
            var chatMessage         = request.body;
            chatMessageService.createChatMessage(requestContext, chatMessage, function(throwable, entity) {
                var chatMessageJson = null;
                if (entity) {
                    chatMessageJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        expressApp.put('/api/v1/chatmessage/:id', function(request, response) {
            var requestContext  = request.requestContext;
            var chatMessageId   = request.params.id;
            var updates         = request.body;
            chatMessageService.updateChatMessage(requestContext, chatMessageId, updates, function(throwable, entity) {
                var chatMessageJson = null;
                if (entity) {
                    chatMessageJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        expressApp.delete('/api/v1/chatmessage/:id', function(request, response) {
            var _this = this;
            var requestContext  = request.requestContext;
            var chatMessageId   = request.params.id;
            chatMessageService.deleteChatMessage(requestContext, chatMessageId, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
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

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveChatMessagesByConversationId: function(request, responder, callback) {
                var data                = request.getData();
                var conversationId      = data.conversationId;
                var requestContext      = request.requestContext;

                chatMessageService.retrieveChatMessagesByConversationId(requestContext, conversationId, function(throwable, chatMessageMap) {
                    _this.processRetrieveEachResponse(responder, throwable, chatMessageIds, chatMessageMap, callback);
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
    module("chatMessageController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("chatMessageService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
