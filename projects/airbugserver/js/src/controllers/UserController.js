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

    _constructor: function(config, expressApp, bugCallServer, bugCallRouter, userService) {

        this._super();


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

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/app/login', function(request, response) {
            var requestContext      = request.requestContext;
            var data                = request.body;
            userService.loginUser(requestContext, data.email, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/app/logout', function(request, response) {
            var requestContext  = request.requestContext;
            userService.logoutUser(requestContext, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/app/register', function(request, response) {
            var requestContext  = request.requestContext;
            var userObject      = request.body;
            userService.registerUser(requestContext, userObject, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/app/user-availability-check-email', function(req, res) {
            var requestContext      = req.requestContext;
            var email               = req.body.email;

            userService.findUserByEmail(email, function(throwable, user) {
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
            retrieveCurrentUser: function(request, responder) {
                var requestContext = request.requestContext;
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
                var requestContext      = request.requestContext;

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
                var requestContext      = request.requestContext;

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

        //TEST
        console.log("Error occurred during request");
        console.log(throwable);
        console.log(throwable.stack);

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
