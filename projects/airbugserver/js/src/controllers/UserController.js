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

    _constructor: function(bugCallRouter, userService, sessionService, connectionService){

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
         * @type {ConnectionService}
         */
         this.connectionService = connectionService;

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
        var connectionService   = this.connectionService;
        var userService         = this.userService;
        var sessionService      = this.sessionService;

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
                userService.findUserById(currentUser.id, function(error, user){
                    if(!error && user){
                        var data        = {user: user};
                        var response    = responder.response("gotCurrentUser", data);
                        responder.sendResponse(response);
                    } else {
                        var data        = {error: error};
                        var response    = responder.response("getCurrentUserError", data);
                    }
                });
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
                //sessionService;
                connectionService.deregisterConnection(currentUser.id, connection);
                userService.logoutUser(currentUser, function(error){
                    if(!error){
                        var data        = {error: null};
                        var response    = responder.response("loggedoutCurrentUser", data);
                    } else {
                        var data        = {error: error};
                        var response    = responder.responde("logoutCurrentUserError", data);
                    }
                    responder.sendResponse(response);
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
            },

            retrieveUser:       function(request, responder){
                var currentUser = request.getHandshake().user;
                var data    = request.getData();
                var userId  = data.userId;
                if(currentUser.isNotAnonymous()){
                    userService.retrieveUser(userId, function(error, user){
                        if(!error && user){
                            var data = {user: user};
                            var response = responder.response("retrievedUser", data);
                        } else {
                            var data = {error: error};
                            var response = responder.response("retrieveUserError", data);
                        }
                        responder.sendResponse(response);
                    });
                } else {
                    var data = {};
                    var response = responder.response("retrieveUserError", data);
                    responder.sendResponse(response);
                }
            },

            //NOTE: Untested
            retrieveUsers:       function(request, responder){
                var currentUser = request.getHandshake().user;
                var data    = request.getData();
                var userIds  = data.userIds;
                if(currentUser.isNotAnonymous()){
                    userService.retrieveUsers(userIds, function(error, users){
                        if(!error && users){
                            var data = {users: users};
                            var response = responder.response("retrievedUser", data);
                        } else {
                            var data = {error: error};
                            var response = responder.response("retrieveUserError", data);
                        }
                        responder.sendResponse(response);
                    });
                } else {
                    var data = {};
                    var response = responder.response("retrieveUserError", data);
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

bugpack.export('airbugserver.UserController', UserController);
