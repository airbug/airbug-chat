//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationController')

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

var ConversationController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, conversationService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationService}
         */
        this.conversationService    = conversationService;

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter          = bugCallRouter;

        /*
         * @private
         * @type {ExpressApp}
         */
        this.expressApp             = expressApp;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this               = this;
        var conversationService = this.conversationService;

        // REST API
        //-------------------------------------------------------------------------------

        this.expressApp.get('/app/conversations/:id', function(request, response){
            var requestContext      = request.requestContext;
            var conversationId      = request.params.id;
            conversationService.retrieveConversation(requestContext, conversationId, function(throwable, entity){
                var conversationJson = null;
                if (entity) conversationJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        this.expressApp.post('/app/conversations', function(request, response){
            var requestContext      = request.requestContext;
            var conversation        = request.body;
            conversationService.createConversation(requestContext, conversation, function(throwable, entity){
                var conversationJson = null;
                if (entity) conversationJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        this.expressApp.put('/app/conversations/:id', function(request, response){
            var requestContext  = request.requestContext;
            var conversationId          = request.params.id;
            var updates         = request.body;
            conversationService.updateConversation(requestContext, conversationId, updates, function(throwable, entity){
                var conversationJson = null;
                if (entity) conversationJson = entity.toObject();
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(conversationJson);
                }
            });
        });

        this.expressApp.delete('/app/conversations/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var conversationId  = request.params.id;
            conversationService.deleteConversation(requestContext, conversationId, function(throwable){
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

                _this.conversationService.retrieveConversation(requestContext, conversationId, function(throwable, conversation) {
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
