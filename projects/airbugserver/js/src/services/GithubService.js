//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var GithubService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {SessionManager} sessionManager
     * @param {GithubManager} githubManager
     * @param {GithubApi} githubApi
     */
    _constructor: function(sessionManager, githubManager, githubApi, userService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager         = sessionManager;

        /**
         * @private
         * @type {GithubManager}
         */
        this.githubManager          = githubManager;

        /**
         * @private
         * @type {GithubApi}
         */
        this.githubApi              = githubApi;

        /**
         * @private
         * @type {UserService}
         */
        this.userService            = userService;
    },


    //-------------------------------------------------------------------------------
    // IBuildRequestContext Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable)} callback
     */
    buildRequestContext: function(requestContext, callback) {
        var _this       = this;
        var session     = requestContext.get("session");
        $series([
            $task(function(flow) {
                _this.ensureGithubStateOnSession(session, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {string} code
     * @param {string} state
     * @param {string} error
     * @param {function(Throwable=)} callback
     */
    loginUserWithGithub: function(requestContext, code, state, error, callback) {
        var _this = this;
        var session = requestContext.get("session");
        var authToken = undefined;
        var githubUser = undefined;
        console.log("GithubService #loginUserWithGithub - code:", code, " state:", state, " error:", error, " session.getData():", session.getData());
        //TODO BRN: If an error comes in, then something is borked with the github integration. Log the error so we can monitor
        if (error) {
            // bad_verification_code - user has
            // incorrect_client_credentials - client_id or client_secret is not set properly.
            console.log("GithubService #loginUserWithGithub error encountered. error ", error);
            callback(new Exception("GithubError"));
        } else if (state !== session.getData().githubState) {
            console.log("GithubService #loginUserWithGithub state mismatch ", state, 'vs', session.getData().githubState);
            //TODO BRN: Verify that state's match
            callback(new Exception("badState"));
        } else {
            console.log('GithubService #loginUserWithGithub No errors. Going to get auth token and retrieve github user');
            $series([
                $task(function(flow) {
                    console.log('GithubService #loginUserWithGithub about to get auth token');
                    try {
                        _this.githubApi.getAuthToken(code, function(throwable, token) {
                            console.log("loginUserWithGithub# in getAuthToken callback. token = ", token, " throwable = ", throwable);
                            authToken = token;
                            flow.complete(throwable);
                        });
                    } catch (e) {
                        console.log('GithubService #loginUserWithGithub ERROR calling getAuthToken', e, " trace ", e.trace);
                    }
                }),
                $task(function(flow) {
                    console.log('GithubService #loginUserWithGithub about to get github user');
                    _this.githubApi.retrieveGithubUser(authToken, function(throwable, githubUserObject) {
                        console.log("loginUserWithGithub# in retrieveGithubUser callback. githubUserObject = ", githubUserObject, " throwable = ", throwable);
                        githubUser = githubUserObject;
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    console.log('GithubService #loginUserWithGithub TODO: finish this.');
                if (throwable) {
                    callback(throwable);
                } else {
                    var githubId = githubUser.id;
                    // TODO - dkk - are we currently logged in?
                        // if we are logged in, then we wouldn't have gotten here from the login page. We are here
                        // because we are linking. We still need to make sure that the github id is
                    if (!TypeUtil.isNumber(githubId)) {
                        callback(new Error("NotFound"));
                    } else {
                        // TODO - dkk - attempt to load the Github record having this github id
                        _this.githubManager.retrieveGithubByGithubId(githubId, function(throwable, github) {
                            if (throwable) {
                                callback(throwable);
                            } else {
                                if (github) {
                                    _this.userService.loginUser(requestContext, github.getUser(), function(throwable, user) {
                                        callback(throwable);
                                    });
                                } else {
                                    // No github record found. Send them off to register.
                                    _this.addGithubDataToSession(session, githubUser.id, authToken, function() {
                                        callback();
                                    })
                                }
                            }
                        });
                    }
                    // TODO - dkk - if the id exists then we need to load the user associated with this github id
                    // TODO - dkk - if the id is not found, attempt to find emails and name. these may not be available.
                    // TODO - dkk - Store in the session that we are doing a github registration
                }
            });
        }

        //DONE BRN: Make a request to the github api to retrieve the access token
        //TODO BRN: Lookup
        //TODO BRN: Look at the currentUser,
        // TODO: if anonymous we need to register to collect email and first/last name. NOT password.
        // TODO: if logged in currently then
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Session} session
     * @param {function(Throwable)} callback
     */
    ensureGithubStateOnSession: function(session, callback) {
        var sessionData = session.getData();
        if (!sessionData.githubState) {
            sessionData.githubState = this.generateGithubState();
        }
        this.sessionManager.updateSession(session, function(throwable, session) {
            callback(throwable);
        });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable)} callback
     */
    addGithubDataToSession: function(session, githubId, authToken, callback) {
        var sessionData = session.getData();
        sessionData.githubId = githubId;
        sessionData.githubAuthToken = authToken;
        this.sessionManager.updateSession(session, function(throwable, session) {
            callback(throwable);
        });
    },

    /**
     * @private
     * @returns {string}
     */
    generateGithubState: function() {
        return UuidGenerator.generateUuid();
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(GithubService, IBuildRequestContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubService', GithubService);
