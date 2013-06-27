//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('CurrentUserController')

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

var CurrentUserController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, currentUserService, sessionService){

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
        var userService     = this.userService;
        var sessionService  = this.sessionService;
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
                    userService.establishUser(user, function(error, user){
                        // sessionService.regenerateSession();
                        //replace session
                        //replace user in session object
                        if(!error && user){
                            request.getHandshake().user = user;
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
                // See if currentUser has a populated roomsList???
                var response    = responder.response("gotCurrentUser", data);
                responder.sendResponse(response);
            },

            loginUser:          function(request, responder){
                //TODO: Check if another user is already logged in and log them out
                var data = request.getData()
                var user = data.user;
                userService.loginUser(user, function(error, user){
                    if(!error && user){
                        request.getHandshake().user = user;
                        var data        = {user: user};
                        var response    = responder.response("loggedInUser", data);
                    } else {
                        var data        = {error: error};
                        var response    = responder.response("logInUserError", data);
                    }
                    responder.sendResponse(response);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            logoutCurrentUser:  function(request, responder){
                //TODO
                var currentUser = request.getHandshake().user;
                var connection  = request.getCallConnection();
                connectionService.deregisterConnection(currentUser.id, connection);
                userService.logoutUser(currentUser, function(error){

                });
            },

            registerUser:       function(request, responder){
                //TODO: Check if another user is already logged in and log them out
                var data = request.getData()
                var user = data.user;
                userService.registerUser(user, function(error, user){
                    if(!error && user){
                        request.getHandshake().user = user;
                        var data        = {user: user};
                        var response    = responder.response("registeredUser", data);
                    } else {
                        var data        = {error: error};
                        var response    = responder.response("registerUserError", data);
                    }
                    responder.sendResponse(response);
                });
            }
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.CurrentUserController', CurrentUserController);
