//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageController')

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')


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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, chatMessageService) {

        this._super(expressApp, bugCallRouter);


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
    // Public  Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this               = this;
        var expressApp          = this.getExpressApp();
        var chatMessageService  = this.getChatMessageService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/app/chatMessages/:id', function(request, response){
            var requestContext      = request.requestContext;
            var chatMessageId       = request.params.id;
            chatMessageService.retrieveChatMessage(requestContext, chatMessageId, function(throwable, entity){
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

        expressApp.post('/app/chatMessages', function(request, response){
            var requestContext      = request.requestContext;
            var chatMessage         = request.body;
            chatMessageService.createChatMessage(requestContext, chatMessage, function(throwable, entity){
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

        expressApp.put('/app/chatMessages/:id', function(request, response){
            var requestContext  = request.requestContext;
            var chatMessageId   = request.params.id;
            var updates         = request.body;
            chatMessageService.updateChatMessage(requestContext, chatMessageId, updates, function(throwable, entity){
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

        expressApp.delete('/app/chatMessages/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var chatMessageId   = request.params.id;
            chatMessageService.deleteChatMessage(requestContext, chatMessageId, function(throwable){
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
             * @param {function(Throwable)} callback
             */
            createChatMessage: function(request, responder, callback) {
                var data                = request.getData();
                var chatMessageData     = data.object;
                var requestContext      = request.requestContext;

                chatMessageService.createChatMessage(requestContext, chatMessageData, function(throwable, chatMessage) {
                    _this.processCreateResponse(responder, throwable, chatMessage, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
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
             * @param {function(Throwable)} callback
             */
            retrieveChatMessages: function(request, responder, callback) {
                var data                = request.getData();
                var chatMessageIds      = data.objectIds;
                var requestContext      = request.requestContext;

                chatMessageService.retrieveChatMessages(requestContext, chatMessageIds, function(throwable, chatMessageMap) {
                    _this.processRetrieveEachResponse(responder, throwable, chatMessageIds, chatMessageMap, callback);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
