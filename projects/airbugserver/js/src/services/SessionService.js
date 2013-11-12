//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionService')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.Cookie')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var cookie                  = require('cookie');
var signature               = require('cookie-signature');
var crc32                   = require('buffer-crc32');
var url                     = require('url');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var Cookie                  = bugpack.require('airbugserver.Cookie');
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

    _constructor: function(config, cookieParser, cookieSigner, sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionServiceConfig}
         */
        this.config         = config;

        /**
         * @private
         * @type {CookieParser}
         */
        this.cookieParser   = cookieParser;

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
        if (requestContext.getType() === RequestContext.Types.BUGCALL) {
            sessionId = requestContext.getRequest().getHandshake().sessionId;
        } else {
            sessionId = requestContext.getRequest().sessionId;
        }

        if (!sessionId) {
            this.generateSession({}, function(throwable, session) {
                if (!throwable) {
                    requestContext.set("session", session);
                }
                callback(throwable);
            });
        } else {
            this.loadSessionBySid(sessionId, function(throwable, session) {
                if (!throwable) {
                    requestContext.set("session", session);
                }
                callback(throwable);
            });
        }
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
        var sessionKey  = this.config.getSessionKey();
        if (handshakeData.headers.cookie) {
            handshakeData.cookie        = this.cookieParser.parse(handshakeData.headers.cookie);
            handshakeData.sessionId     = this.cookieSigner.unsign(handshakeData.cookie[sessionKey]);
            callback(undefined, true);
        } else {
            console.log("Finish SessionService shake first else");
            callback(new Error('No cookie transmitted.'), false);
        }
    },


    //-------------------------------------------------------------------------------
    // Express Methods
    //-------------------------------------------------------------------------------

    /**
     * @param req
     * @param res
     * @param next
     */
    processExpressRequest: function(req, res, next) {
        //TEST
        console.log("Process express request");

        var _this = this;
        var cookiePath      = this.config.getCookiePath();
        var originalPath    = url.parse(req.originalUrl).pathname;
        if (0 != originalPath.indexOf(cookiePath || '/')) {
            return next();
        }

        var cookieSecret = this.config.getCookieSecret();
        if (!cookieSecret) {
            throw new Error("'secret' option required for sessions");
        }

        var sessionKey      = this.config.getSessionKey();
        var rollingSessions = this.config.getRollingSessions();
        var originalHash    = undefined;
        var originalId      = undefined;
        var rawCookie       = req.cookies[sessionKey];
        var unsignedCookie  = req.signedCookies[sessionKey];
        if (!unsignedCookie && rawCookie) {
            unsignedCookie = this.cookieSigner.unsign(rawCookie);
        }

        // set-cookie
        res.on('header', function() {

            var session = req.requestContext.get("session");
            var cookie  = session.getCookie();
            var proto   = (req.headers['x-forwarded-proto'] || '').split(',')[0].toLowerCase().trim();
            var tls     = req.connection.encrypted || (_this.config.getTrustProxy() && 'https' == proto);
            var isNew   = unsignedCookie != req.sessionId;

            // only send secure cookies via https
            if (cookie.isSecure() && !tls) {
                console.log("connection not secured - not sending cookie");
                return;
            }

            // in case of rolling session, always reset the cookie
            if (!rollingSessions) {

                // long expires, handle expiry server-side
                if (!isNew && cookie.hasLongExpires()) {
                    console.log('already set cookie');
                    return;
                }

                // browser-session length cookie
                if (null == cookie.getExpires()) {
                    if (!isNew) {
                        console.log('already set browser-session cookie');
                        return;
                    }
                    // compare hashes and ids
                } else if (originalHash == hash(session.toObject()) && originalId == session.getSid()) {
                    console.log('unmodified session');
                    return;
                }

            }

            var val = 's:' + _this.cookieSigner.sign(session.getSid());
            val = cookie.serialize(sessionKey, val);
            res.setHeader('Set-Cookie', val);
        });
        req.sessionId = unsignedCookie;

        //TEST
        console.log("Finished Parsing cookie - req.sessionId:", req.sessionId);

        next();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Session} session
     * @param {function(Throwable)} callback
     */
    deleteSession: function(session, callback) {
        this.sessionManager.deleteSessionBySid(session.getSid(), function(throwable) {
             callback(throwable);
        });
    },

    /**
     * @param {Object} data
     * @param {function(Throwable, Session)} callback
     */
    generateSession: function(data, callback) {
        if (!TypeUtil.isObject(data.data)) {
            data.data = {};
        }
        if (!TypeUtil.isString(data.sid)) {
            data.sid = UuidGenerator.generateUuid();
        }
        if (!TypeUtil.isObject(data.cookie)) {
            data.cookie = {};
        }
        if (!data.cookie.expires) {
            data.cookie.expires = new Date(Date.now() + this.config.getCookieMaxAge());
        }
        if (!TypeUtil.isString(data.cookie.path)) {
            data.cookie.path = this.config.getCookiePath();
        }
        var session = this.sessionManager.generateSession(data);
        this.sessionManager.createSession(session, function(throwable) {
            if (!throwable) {
                callback(undefined, session);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable, Session)} callback
     */
    regenerateSession: function(session, callback) {
        var _this           = this;
        $series([
            $task(function(flow) {
                _this.sessionManager.deleteSessionBySid(session.getSid(), function(throwable) {
                     flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var data = session.getDeltaDocument().getData();
                delete data.sid;
                delete data.id;
                delete data._id;
                _this.generateSession(data, function(throwable, generatedSession) {
                    if (!throwable) {
                        session = generatedSession;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, session);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {function(Throwable, Session)} callback
     */
    loadSessionBySid: function(sid, callback) {
        var _this   = this;
        var session = undefined;
        $series([
            $task(function(flow) {
                _this.sessionManager.retrieveSessionBySid(sid, function(throwable, retrievedSession) {
                    if (!throwable) {
                        session = retrievedSession;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                if (session) {
                    var expires = TypeUtil.isString(session.getExpires())
                        ? new Date(session.getExpires())
                        : session.getExpires();
                    if (expires && new Date > expires) {
                        _this.sessionManager.deleteSessionBySid(sid, function(throwable) {
                            session = undefined;
                            flow.complete(throwable);
                        });
                    } else {
                        flow.complete();
                    }
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                if (!session) {
                    _this.generateSession({}, function(throwable, retrievedSession) {
                        if (!throwable) {
                            session = retrievedSession;
                        }
                        flow.complete(throwable);
                    });
                } else {
                    session.resetMaxAge();
                    _this.sessionManager.updateSession(session, function(throwable) {
                        flow.complete(throwable);
                    });
                }
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


/**
 * Hash the given `sess` object omitting changes
 * to `.cookie`.
 *
 * @param {Object} sess
 * @return {String}
 * @api private
 */

function hash(sess) {
    return crc32.signed(JSON.stringify(sess, function(key, val){
        if ('cookie' != key) return val;
    }));
}
