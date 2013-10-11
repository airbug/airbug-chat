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

    _constructor: function(bugCallRouter, conversationService, requestContextFactory) {

        this._super(requestContextFactory);


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
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this               = this;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveConversation: function(request, responder) {
                var data                = request.getData();
                var conversationId      = data.objectId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.conversationService.retrieveConversation(requestContext, conversationId, function(throwable, conversation) {
                    _this.processRetrieveResponse(responder, throwable);
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationController', ConversationController);
