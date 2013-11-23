//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
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
     */
    _constructor: function(sessionManager, githubManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager         = sessionManager;

        this.githubManager          = githubManager;
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
        console.log("GithubService #loginUserWithGithub - code:", code, " state:", state, " error:", error, " session.getData():", session.getData());
        var _this = this;
        var session = requestContext.get("session");
        var authToken = undefined;
        var githubUser = undefined;
        //TODO BRN: If an error comes in, then something is borked with the github integration. Log the error so we can monitor
        if (error) {
            // bad_verification_code - user has
            // incorrect_client_credentials - client_id or client_secret is not set properly.
            callback(new Exception("GithubError"));
        } else if (state !== session.getData().githubState) {
            //TODO BRN: Verify that state's match
            callback(new Exception("badState"));
        } else {
            $series([
                $task(function(flow) {
                    _this.githubManager.getAuthToken(code, function(throwable, token) {
                        authToken = token;
                        flow.complete();
                    });
                }),
                $task(function(flow) {
                    _this.githubManager.retrieveGithubUser(authToken, function(throwable, githubUserObject) {
                        githubUser = githubUserObject;
                        flow.complete();
                    });
                })
            ]).execute(function() {
                // TODO - dkk - finish login process
                callback();
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
