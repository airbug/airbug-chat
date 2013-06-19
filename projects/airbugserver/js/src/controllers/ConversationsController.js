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

    _constructor: function(bugCallRouter, conversationService){

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
            retrieveConversation: function(request, responder){
                var currentUser = request.getHandshake().session.user;
                if(currentUser.isNotAnonymous()){
                    var data = request.getData();
                    var conversationId = data.conversationId;
                    _this.conversationService.retrieveConversation(currentUser, conversationId, function(error, conversation){
                        if(!error && conversation){
                            var data = {conversation: conversation};
                            var response = responder.response("retrievedConversation", data);
                        } else {
                            var data = {error: error};
                            var response = responder.response("retrieveConversationError", data);
                        }
                        responder.sendResponse(response);
                    });
                }
            }
        });

        callback();

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationController', ConversationController);
