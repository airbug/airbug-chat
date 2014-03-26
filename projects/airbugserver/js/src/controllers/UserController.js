//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


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
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, userService, marshaller) {

        this._super(controllerManager, expressApp, bugCallRouter, marshaller);


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
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this           = this;
        var expressApp      = this.getExpressApp();
        var userService     = this.getUserService();

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/api/login', function(request, response) {
            var requestContext      = request.requestContext;
            var data                = request.body;
            userService.loginUserWithEmailAndPassword(requestContext, data.email, data.password, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(response, throwable);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/api/logout', function(request, response) {
            var requestContext  = request.requestContext;
            userService.logoutUser(requestContext, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(response, throwable);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/api/register', function(request, response) {
            console.log("user controller register");
            var requestContext  = request.requestContext;
            var userObject      = request.body;

            requestContext.set("ipAddress", request.ip);
            requestContext.set("acceptedLanguages", request.acceptedLanguages);
            requestContext.set("userAgent", request.get("user-agent"));

            userService.registerUser(requestContext, userObject, function(throwable) {
                console.log("throwable:", throwable);
                if (throwable) {
                    _this.processAjaxThrowable(response, throwable);
                } else {
                    _this.sendAjaxSuccessResponse(response);
                }
            });
        });

        expressApp.post('/api/user-availability-check-email', function(req, res) {
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

        expressApp.get('/api/v1/user/:id', function(request, response){
            var requestContext      = request.requestContext;
            var userId              = request.params.id;
            userService.retrieveUser(requestContext, userId, function(throwable, entity){
                _this.processAjaxRetrieveResponse(response, throwable, entity);
            });
        });

        expressApp.post('/api/v1/user', function(request, response){
            var requestContext      = request.requestContext;
            var user                = request.body;
            userService.createUser(requestContext, user, function(throwable, entity){
                _this.processAjaxCreateResponse(response, throwable, entity);
            });
        });

        expressApp.put('/api/v1/user/:id', function(request, response){
            var requestContext  = request.requestContext;
            var userId          = request.params.id;
            var updates         = request.body;
            userService.updateUser(requestContext, userId, updates, function(throwable, entity){
                _this.processAjaxUpdateResponse(response, throwable, entity);
            });
        });

        expressApp.delete('/api/v1/user/:id', function(request, response){
            var _this = this;
            var requestContext  = request.requestContext;
            var userId          = request.params.id;
            userService.deleteUser(requestContext, userId, function(throwable){
                _this.processAjaxDeleteResponse(response, throwable, entity);
            });
        });

        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
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
             * @param {function(Throwable=)} callback
             */
            retrieveUser: function(request, responder, callback) {
                var data                = request.getData();
                var userId              = data.objectId;
                var requestContext      = request.requestContext;

                userService.retrieveUser(requestContext, userId, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable, user, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveUsers: function(request, responder, callback) {
                var data                = request.getData();
                var userIds             = data.objectIds;
                var requestContext      = request.requestContext;

                userService.retrieveUsers(requestContext, userIds, function(throwable, userMap) {
                    _this.processRetrieveEachResponse(responder, throwable, userIds, userMap, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            updateUser: function(request, responder, callback) {
                var data                = request.getData();
                var userId              = data.objectId;
                var updateObject        = data.updateObject;
                var requestContext      = request.requestContext;

                userService.updateUser(requestContext, userId, updateObject, function(throwable, user) {
                    _this.processUpdateResponse(responder, throwable, user, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            updateUserPassword: function(request, responder, callback) {
                var data                = request.getData();
                var userId              = data.userId;
                var updateObject        = data.updateObject;
                var requestContext      = request.requestContext;

                userService.updateUserPassword(requestContext, userId, updateObject, function(throwable, user) {
                    _this.processUpdateResponse(responder, throwable, user, callback);
                });
            }
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserController).with(
    module("userController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("userService"),
            arg().ref("marshaller")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserController', UserController);
