//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionService')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var cookie                  = require('cookie');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var IHand                   = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cookieSigner, sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CookieSigner}
         */
        this.cookieSigner   = cookieSigner;

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager = sessionManager;
    },


    //-------------------------------------------------------------------------------
    // IBuildRequestContext Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable)} callback
     */
    buildRequestContext: function(requestContext, callback) {
        var sessionId = undefined;


        //TEST
        console.log("SessionService buildRequestContext - requestContext.getRequest():", requestContext.getRequest());

        if (requestContext.getType() === RequestContext.Types.BUGCALL) {
            sessionId = requestContext.getRequest().getHandshake().sessionId;
        } else {
            sessionId = requestContext.getRequest().sessionID;
        }

        //TEST
        console.log("SessionService buildRequestContext - sessionId:", sessionId);

        //NOTE BRN: Load the correct version of the session

        this.sessionManager.retrieveSessionBySid(sessionId, function(throwable, session) {
            if (!throwable) {
                requestContext.set("session", session);
            }
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {
     *    headers: req.headers       // <Object> the headers of the request
     *  , time: (new Date) +''       // <String> date time of the connection
     *  , address: socket.address()  // <Object> remoteAddress and remotePort object
     *  , xdomain: !!headers.origin  // <Boolean> was it a cross domain request?
     *  , secure: socket.secure      // <Boolean> https connection
     *  , issued: +date              // <Number> EPOCH of when the handshake was created
     *  , url: request.url           // <String> the entrance path of the request
     *  , query: data.query          // <Object> the result of url.parse().query or a empty object
     * } handshakeData
     * @param {function(Error, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {
        console.log("SessionService#shakeIt");
        if (handshakeData.headers.cookie) {
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionId = this.cookieSigner.unsign(handshakeData.cookie['airbug.sid']);
        } else {
            console.log("Finish SessionService shake first else");
            callback(new Error('No cookie transmitted.'), false);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Session} session
     * @param {RequestContext} requestContext
     * @param {function(Throwable, Session)} callback
     */
    regenerateSession: function(session, requestContext, callback) {
        var _this           = this;
        var expressRequest  = requestContext.getRequest();
        var expressSession  = expressRequest.session;
        var session         = undefined;

        //TEST
        console.log("SessionService regenerateSession (before) - expressRequest.sessionID:", expressRequest.sessionID);

        $series([
            $task(function(flow) {
                expressSession.regenerate(function(throwable) {

                    //NOTE: session.regenerate replaces req.session with a new session
                    expressSession = expressRequest.session;

                    //TEST
                    console.log("SessionService regenerateSession (after) - expressRequest.sessionID:", expressRequest.sessionID);
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                expressSession.save(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionManager.retrieveSessionBySid(expressRequest.sessionID, function(throwable, retrievedSession) {
                    if (!throwable) {
                            if (retrievedSession) {
                                requestContext.set("session", retrievedSession);
                                session = retrievedSession;
                                flow.complete();
                            } else {
                                flow.error(new Error("Could not find regenerated session"));
                            }
                    } else {
                        flow.error(throwable);
                    }
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, session);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SessionService, IHand);
Class.implement(SessionService, IBuildRequestContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionService', SessionService);
