//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

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

var UserController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, userService, sessionService){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter      = bugCallRouter;

        /**
         * @private
         * @type {UserService}
         */
         this.sessionService    = sessionService;

        /**
         * @private
         * @type {UserService}
         */
        this.userService        = userService;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this = this;
        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            establishCurrentUser:      function(request, responder){
                //TODO
                console.log("Inside UserController#establishCurrentUser");
                var currentUser = request.getHandshake().user;
                if(currentUser.isAnonymous()){
                    var data = request.getData();
                    var user = data.user;
                    _this.userService.establishUser(user, function(error, user){
                        // _this.sessionService.regenerateSession();
                        //replace session
                        //replace user in session object
                        if(!error && user){
                            var data        = {user: user};
                            var response    = responder.response("establishedUser", data);
                        } else {
                            var data        = {error: error};
                            var response    = responder.response("establishUserError", data);
                        }
                        responder.sendResponse(response);
                    })
                } else {
                    //TODO
                    var data        = {};
                    var response    = responder.response("establishUserError", data);
                    responder.sendResponse(response)
                }
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            getCurrentUser:     function(request, responder){
                var currentUser = request.getHandshake().user;
                var data        = {currentUser: currentUser};
                var response    = responder.response("gotCurrentUser", data);
                responder.sendResponse(response);
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            logoutCurrentUser:  function(request, responder){
                //TODO
                var currentUser = request.getHandshake().user;
                var connection  = request.getCallConnection();
                this.connectionService.deregisterConnection(currentUser.id, connection);
                this.userService.logoutUser(currentUser, function(error){

                });
            }
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserController', UserController);
