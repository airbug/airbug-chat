//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationController')

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

var ConversationController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, conversationService) {

        this._super(expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Declare Variables
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
     *
     */
    configure: function() {
        var _this               = this;
        var expressApp          = this.getExpressApp();
        var conversationService = this.getConversationService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/app/conversations/:id', function(request, response) {
            var requestContext      = request.requestContext;
            var conversationId      = request.params.id;
            conversationService.retrieveConversation(requestContext, conversationId, function(throwable, entity) {
                var conversationJson = null;
                if (entity) {
                    conversationJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        expressApp.post('/app/conversations', function(request, response) {
            var requestContext      = request.requestContext;
            var conversation        = request.body;
            conversationService.createConversation(requestContext, conversation, function(throwable, entity) {
                var conversationJson = null;
                if (entity) {
                    conversationJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        expressApp.put('/app/conversations/:id', function(request, response) {
            var requestContext  = request.requestContext;
            var conversationId          = request.params.id;
            var updates         = request.body;
            conversationService.updateConversation(requestContext, conversationId, updates, function(throwable, entity) {
                var conversationJson = null;
                if (entity) {
                    conversationJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        expressApp.delete('/app/conversations/:id', function(request, response) {
            var _this = this;
            var requestContext  = request.requestContext;
            var conversationId  = request.params.id;
            conversationService.deleteConversation(requestContext, conversationId, function(throwable) {
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
            retrieveConversation: function(request, responder, callback) {
                var data                = request.getData();
                var conversationId      = data.objectId;
                var requestContext      = request.requestContext;

                conversationService.retrieveConversation(requestContext, conversationId, function(throwable, conversation) {
                    _this.processRetrieveResponse(responder, throwable, conversation, callback);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationController', ConversationController);
