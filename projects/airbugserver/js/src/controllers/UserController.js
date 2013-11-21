//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
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
var LiteralUtil         = bugpack.require('LiteralUtil');
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

    _constructor: function(expressApp, bugCallRouter, userService) {

        this._super(expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserService}
         */
        this.userService            = userService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {UserService}
     */
    getUserService: function() {
        return this.userService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this           = this;
        var expressApp      = this.getExpressApp();
        var userService     = this.getUserService();

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/app/login', function(request, response) {
            var requestContext      = request.requestContext;
            var data                = request.body;
            userService.loginUser(requestContext, data.email, data.password, function(throwable) {
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

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/app/users/:id', function(request, response){
            var requestContext      = request.requestContext;
            var userId              = request.params.id;
            userService.retrieveUser(requestContext, userId, function(throwable, entity){
                var userJson = null;
                if (entity) {
                    userJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(userJson);
                }
            });
        });

        expressApp.post('/app/users', function(request, response){
            var requestContext      = request.requestContext;
            var user                = request.body;
            userService.createUser(requestContext, user, function(throwable, entity){
                var userJson = null;
                if (entity) {
                    userJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(userJson);
                }
            });
        });

        expressApp.put('/app/users/:id', function(request, response){
            var requestContext  = request.requestContext;
            var userId          = request.params.id;
            var updates         = request.body;
            userService.updateUser(requestContext, userId, updates, function(throwable, entity){
                var userJson = null;
                if (entity) {
                    userJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(userJson);
                }
            });
        });

        expressApp.delete('/app/users/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var userId          = request.params.id;
            userService.deleteUser(requestContext, userId, function(throwable){
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    _this.sendAjaxSuccessResponse(response);
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
             * @param {function(Throwable)} callback
             */
            retrieveCurrentUser: function(request, responder, callback) {
                console.log("UserController#retrieveCurrentUser");
                var requestContext = request.requestContext;
                userService.retrieveCurrentUser(requestContext, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable, user, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveUser: function(request, responder, callback) {
                console.log("UserController#retrieveUser");
                var data                = request.getData();
                var userId              = data.objectId;
                var requestContext      = request.requestContext;
                console.log("data", data);
                console.log("userId ", userId);
                userService.retrieveUser(requestContext, userId, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable, user, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveUsers: function(request, responder, callback) {
                var data                = request.getData();
                var userIds             = data.objectIds;
                var requestContext      = request.requestContext;

                userService.retrieveUsers(requestContext, userIds, function(throwable, userMap) {
                    _this.processRetrieveEachResponse(responder, throwable, userIds, userMap, callback);
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
