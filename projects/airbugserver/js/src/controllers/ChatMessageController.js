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

    _constructor: function(bugCallRouter, chatMessageService, requestContextFactory) {

        this._super(requestContextFactory);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

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
     * @param {function(Error)} callback
     */
    configure: function(callback) {
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            createChatMessage: function(request, responder){
                var data                = request.getData();
                var chatMessageData     = data.object;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.chatMessageService.createChatMessage(requestContext, chatMessageData, function(throwable, chatMessage) {
                    _this.processCreateResponse(responder, throwable, chatMessage);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveChatMessagesByConversationId: function(request, responder) {
                var data                = request.getData();
                var conversationId      = data.conversationId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.chatMessageService.retrieveChatMessagesByConversationId(requestContext, conversationId, function(throwable, chatMessageMap) {
                    _this.processRetrieveEachResponse(responder, throwable, chatMessageMap.getKeyArray(), chatMessageMap);
                });
            }
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
