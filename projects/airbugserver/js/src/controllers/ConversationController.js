//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationController')
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

var ConversationController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, conversationService) {

        this._super(controllerManager, expressApp, bugCallRouter);


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

        expressApp.post('/api/v1/conversation', function(request, response) {
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

        expressApp.put('/api/conversation/:id', function(request, response) {
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

        expressApp.delete('/api/conversation/:id', function(request, response) {
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

bugmeta.annotate(ConversationController).with(
    module("conversationController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("conversationService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationController', ConversationController);
