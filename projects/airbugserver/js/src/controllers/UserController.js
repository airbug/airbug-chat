//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserController')

//@Require('Class')
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

    _constructor: function(config, expressApp, bugCallRouter, userService, sessionService, requestContextFactory) {

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
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this = this;
        var expressApp      = this.expressApp;
        var userService     = this.userService;
        var sessionService  = this.sessionService;

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

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
        });

        //TODO: SUNG Improve and rename
        expressApp.get('/app/retrieveCurrentUser', function(req, res){
            var sessionID       = req.sessionID;
            var session         = req.session;
            var userId          = session.userId;

            res.json({});
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
            loginUser: function(request, responder){
                var data                = request.getData();
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
                var formData            = data.formData;

                _this.userService.loginUser(requestContext, request, formData, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable)
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             */
            registerUser:function(request, responder){
                var data                = request.getData();
                var requestContext      = _this.requestContextFactory.factoryRequestContext(request);
                var formData            = data.formData;

                _this.userService.registerUser(requestContext, request, formData, function(throwable, user) {
                    _this.processRetrieveResponse(responder, throwable)
                });
            },

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

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserController', UserController);
