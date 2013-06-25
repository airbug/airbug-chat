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

    _constructor: function(bugCallRouter, chatMessageService){

        this._super();


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
                var currentUser = request.getHandshake().user;
                if(currentUser.isNotAnonymous()){
                    var data        = request.getData();
                    var chatMessage = data.chatMessage;
                    _this.chatMessageService.createChatMessage(currentUser, chatMessage, function(error, chatMessage){
                        if(!error && chatMessage){
                            var data = {chatMessage: chatMessage};
                            var response = responder.response("createdChatMessage", data);
                        } else {
                            var data = {error: error};
                            var response = responder.response("createChatMessageError", data);
                        }
                        responder.sendResponse(response);
                    });
                } else {
                    var data        = {error: new Error("Unauthorized Access")};
                    var response    = responder.response("createChatMessageError", data);
                    responder.sendResponse(response);
                }
            }
        });

        callback();

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageController', ChatMessageController);
