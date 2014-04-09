//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageStreamController')
//@Autoload

//@Require('Class')
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

var ChatMessageStreamController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, chatMessageStreamService, marshaller) {

        this._super(controllerManager, expressApp, bugCallRouter, marshaller);


        //-------------------------------------------------------------------------------
        // Declare Variables
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

bugmeta.annotate(ChatMessageStreamController).with(
    module("chatMessageStreamController")
        .args([
            arg().ref("controllerManager"),
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
