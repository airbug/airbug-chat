//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageController')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, chatMessageService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp             = expressApp;

        /**
         * @private
         * @type {RoomService}
         */
        this.chatMessageService     = chatMessageService;

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter          = bugCallRouter;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this               = this;
        var chatMessageService  = this.chatMessageService;

        // REST API
        //-------------------------------------------------------------------------------

        this.expressApp.get('/app/chatMessages/:id', function(request, response){
            var requestContext      = request.requestContext;
            var chatMessageId       = request.params.id;
            chatMessageService.retrieveChatMessage(requestContext, chatMessageId, function(throwable, entity){
                var chatMessageJson = null;
                if (entity) chatMessageJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        this.expressApp.post('/app/chatMessages', function(request, response){
            var requestContext      = request.requestContext;
            var chatMessage         = request.body;
            chatMessageService.createChatMessage(requestContext, chatMessage, function(throwable, entity){
                var chatMessageJson = null;
                if (entity) chatMessageJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        this.expressApp.put('/app/chatMessages/:id', function(request, response){
            var requestContext  = request.requestContext;
            var chatMessageId   = request.params.id;
            var updates         = request.body;
            chatMessageService.updateChatMessage(requestContext, chatMessageId, updates, function(throwable, entity){
                var chatMessageJson = null;
                if (entity) chatMessageJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(chatMessageJson);
                }
            });
        });

        this.expressApp.delete('/app/chatMessages/:id', function(request, response){
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

                _this.chatMessageService.createChatMessage(requestContext, chatMessageData, function(throwable, chatMessage) {
                    _this.processCreateResponse(responder, throwable, chatMessage, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveChatMessagesByConversationId: function(request, responder, callback) {
                var data                = request.getData();
                var conversationId      = data.conversationId;
                var requestContext      = request.requestContext;

                _this.chatMessageService.retrieveChatMessagesByConversationId(requestContext, conversationId, function(throwable, chatMessageMap) {
                    _this.processRetrieveEachResponse(responder, throwable, chatMessageMap.getKeyArray(), chatMessageMap, callback);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
