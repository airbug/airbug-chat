//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

//@Require('Class')
//@Require('Exception')
//@Require('airbugserver.EntityController')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var EntityController    = bugpack.require('airbugserver.EntityController');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(config, expressApp, bugCallServer, bugCallRouter, userService, sessionService, requestContextFactory) {

        this._super(requestContextFactory);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter          = bugCallRouter;

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer          = bugCallServer;

        /**
         * @private
         * @type {}
         */
        this.config                 = config;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp             = expressApp;

        /**
         * @private
         * @type {SessionService}
         */
        this.sessionService         = sessionService;

        /**
         * @private
         * @type {UserService}
         */
        this.userService            = userService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this           = this;
        var expressApp      = this.expressApp;
        var userService     = this.userService;
        var sessionService  = this.sessionService;

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/app/login', function(request, response) {
            var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
            var cookies             = request.cookies;
            var signedCookies       = request.signedCookies;
            var oldSid              = request.sessionID;
            var session             = request.session;
            var params              = request.params;
            var query               = request.query;
            var data                = request.body;
            var returnedUser;

            console.log("cookies:", cookies, "signedCookies:", signedCookies, "session:", session, "data:", data, "params:", params, "query:", query);
            $series([
                $task(function(flow) {
                    userService.loginUser(requestContext, data.email, function(throwable, user) {
                        if (!throwable) {
                            returnedUser = user;
                            flow.complete();
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    sessionService.regenerateSession(oldSid, request, returnedUser.getId(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                   _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });

            // find all callconnections related to the oldSid and send them a refreshConnectionForLogin request
            // Make sure there are no issues with client-side initiated disconnect.
        });

        expressApp.post('/app/logout', function(req, res){
            var cookies         = req.cookies;
            var signedCookies   = req.signedCookies;
            var oldSid          = req.sessionID;
            var session         = req.session;
            var params          = req.params;
            var query           = req.query;
            var body            = req.body;

            session.destroy(function(error){
                if(error){
                    var error = error.toString();
                    console.log(error);
                    res.json({error: error});
                } else {
                    res.json({error: null});
                }
            });

            // find all callconnections related to the oldSid and send them a refreshConnectionForLogout request

        });

        expressApp.post('/app/register', function(req, res) {
            var cookies         = req.cookies;
            var signedCookies   = req.signedCookies;
            var oldSid          = req.sessionID;
            var session         = req.session;
            var params          = req.params;
            var query           = req.query;
            var userObject      = req.body;
            var returnedUser;

            console.log("cookies:", cookies, "signedCookies:", signedCookies, "session:", session, "userObject:", userObject, "params:", params, "query:", query);
            $series([
                $task(function(flow){
                    userService.registerUser(userObject, function(throwable, user) {
                        returnedUser = user;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow){
                    sessionService.regenerateSession(oldSid, req, returnedUser.getId(), function(throwable) {
                        if (!throwable) {
                            res.json({error: null});
                        }
                        flow.complete(throwable);
                    });
                })
                // ,
                // $task(function(flow){
                // find all callconnections related to the oldSid and send them a refreshConnectionForRegister request
                // })
            ]).execute(function(throwable) {
                if (throwable) {
                    res.json({error: throwable.toString(), user: null});
                }
            });
        });

        expressApp.post('/app/user-availability-check-email', function(req, res){
            var email = req.body.email;

            userService.findUserByEmail(email, function(throwable, user){
                if (!throwable) {
                    if (user) {
                        res.send("false");
                    } else {
                        res.send("true");
                    }
                } else {
                    res.send(throwable.toString());
                }
            });
        });

        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            // loginUser: function(request, responder){
            //     var data                = request.getData();
            //     var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
            //     var formData            = data.formData;

            //     _this.userService.loginUser(requestContext, formData, function(throwable, user) {
            //         _this.processRetrieveResponse(responder, throwable)
            //     });
            // },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            // registerUser:function(request, responder){
            //     var data                = request.getData();
            //     var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
            //     var formData            = data.formData;

            //     _this.userService.registerUser(requestContext, formData, function(throwable, user) {
            //         _this.processRetrieveResponse(responder, throwable)
            //     });
            // },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveCurrentUser: function(request, responder) {
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.userService.retrieveCurrentUser(requestContext, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable)
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveUser: function(request, responder) {
                var data                = request.getData();
                var userId              = data.userId;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.userService.retrieveUser(requestContext, userId, function(error, throwable) {
                    _this.processRetrieveResponse(responder, throwable);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            retrieveUsers: function(request, responder) {
                var data                = request.getData();
                var userIds             = data.objectIds;
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);

                _this.userService.retrieveUsers(requestContext, userIds, function(throwable, userMap) {
                    _this.processRetrieveEachResponse(responder, throwable, userIds, userMap);
                });
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     * @param {Response} response
     */
    processAjaxThrowable: function(throwable, response) {
        if (Class.doesExtend(throwable, Exception)) {
            if (throwable.getType() === "NotFound") {
                this.sendAjaxNotFoundResponse(response);
            } else {
                this.sendAjaxErrorResponse(throwable, response);
                console.error(throwable);
            }
        } else {
            this.sendAjaxErrorResponse(throwable, response);
        }
    },

    /**
     * @private
     * @param {Error} error
     * @param {Response} response
     */
    sendAjaxErrorResponse: function(error, response) {
        response.status(500);
        response.json({error: error.toString()});
    },

    /**
     * @private
     * @param {Response} response
     */
    sendAjaxNotFoundResponse: function(response) {
        response.status(404);
        response.json({exception: new Exception("NotFound")});
    },

    /**
     * @private
     * @param {Response} response
     */
    sendAjaxSuccessResponse: function(response) {
        response.json({success: true});
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserController', UserController);
