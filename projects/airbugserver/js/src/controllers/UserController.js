//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(config, expressApp, bugCallRouter, userService, sessionService, callService){

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
        this.callService        = callService;

        /**
         * @private
         * @type {}
         */
        this.config             = config;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp         = expressApp;

        /**
         * @private
         * @type {UserService}
         */
        this.sessionService     = sessionService;

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
        var callService     = this.callService;
        var expressApp      = this.expressApp;
        var userService     = this.userService;
        var sessionService  = this.sessionService;

        expressApp.post('/app/register', function(req, res){
            var cookies = req.cookies;
            var signedCookies = req.signedCookies;
            var oldSid  = req.sessionID;
            var session = req.session;
            var params  = req.params;
            var query   = req.query;
            var userObj = req.body;
            var returnedUser;

            console.log("cookies:", cookies, "signedCookies:", signedCookies, "session:", session, "userObj:", userObj, "params:", params, "query:", query);
            $series([
                $task(function(flow){
                    userService.registerUser(userObj, function(error, user){
                        console.log("post /app/register");
                        console.log("error:", error, "user:", user);
                        returnedUser = user;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    sessionService.regenerateSession(oldSid, req, returnedUser, function(error){
                        if(!error){
                            res.json({error: null, user: returnedUser});
                        }
                        flow.complete(error);
                    });
                })
            ]).execute(function(error){
                if(error){
                    res.json({error: error.toString(), user: null});
                }
            });
        });

        expressApp.post('/app/login', function(req, res){
            var session = req.session;
            var params  = req.params;
            var query   = req.query;
            var userObj = req.body;
            userService.loginUser(userObj, function(error, user){

            });
        });

        expressApp.post('/app/logout', function(req, res){
            var session = req.session;
            var params  = req.params;
            var query   = req.query;
            var userObj = req.body;
            userService.logoutUser(userObj, handshake, function(error){

            });
        });

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
                    console.log("error:", error, "user:", user);
                    if(!error && user){
                        request.getHandshake().user = user;
                        var data        = {user: user};
                        var response    = responder.response("loggedInUser", data);
                    } else if (!error && !user){
                        var error       = new Error("User does not exist");
                        var data        = {error: error.toString()};
                        var response    = responder.response("logInUserError", data);
                    } else {
                        var data        = {error: error.toString()};
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
                var handshake   = request.getHandshake();
                var currentUser = handshake.user;
                userService.logoutUser(currentUser, handshake, function(error){
                    if(!error){
                        var data        = {error: null};
                        var response    = responder.response("loggedoutCurrentUser", data);
                    } else {
                        var data        = {error: error.toString()};
                        var response    = responder.response("logoutCurrentUserError", data);
                    }
                    responder.sendResponse(response);
                });
            },

            // registerUser:       function(request, responder){
            //     var handshake   = request.getHandshake();
            //     var currentUser = handshake.user;
            //     var data        = request.getData()
            //     var user        = data.user;
            //     var returnedUser;
            //     $series([
            //         $task(function(flow){
            //             if(currentUser.isNotAnonymous){
            //                 userService.logoutUser(currentUser, handshake, function(error){
            //                     flow.complete(error);
            //                 });
            //             } else {
            //                 flow.complete()
            //             }
            //         }),
            //         $task(function(flow){
            //             userService.registerUser(user, function(error, user){
            //                 returnedUser = user;
            //                 flow.complete(error);
            //             });
            //         })
            //     ]).execute(function(error){
            //         if(!error && returnedUser){
            //             request.getHandshake().user = returnedUser;
            //             var data        = {user: user};
            //             var response    = responder.response("registeredUser", data);
            //         } else {
            //             var data        = {error: error.toString()};
            //             var response    = responder.response("registerUserError", data);
            //         }
            //         responder.sendResponse(response);
            //     });
            // },

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
