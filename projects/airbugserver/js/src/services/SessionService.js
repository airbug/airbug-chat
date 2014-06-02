/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.SessionService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.Cookie')
//@Require('bugcall.IncomingRequest')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IBuildRequestContext')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var cookie                  = require('cookie');
    var signature               = require('cookie-signature');
    var crc32                   = require('buffer-crc32');
    var url                     = require('url');


    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Obj                     = bugpack.require('Obj');
    var StringUtil              = bugpack.require('StringUtil');
    var TypeUtil                = bugpack.require('TypeUtil');
    var UuidGenerator           = bugpack.require('UuidGenerator');
    var Cookie                  = bugpack.require('airbugserver.Cookie');
    var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var ModuleTag        = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var IBuildRequestContext    = bugpack.require('bugrequest.IBuildRequestContext');
    var IHand                   = bugpack.require('handshaker.IHand');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $parallel               = BugFlow.$parallel;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IBuildRequestContext}
     * @implements {IHand}
     */
    var SessionService = Class.extend(Obj, {

        _name: "airbugserver.SessionService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SessionServiceConfig} sessionServiceConfig
         * @param {CookieParser} cookieParser
         * @param {CookieSigner} cookieSigner
         * @param {SessionManager} sessionManager
         * @param {Marshaller} marshaller
         */
        _constructor: function(sessionServiceConfig, cookieParser, cookieSigner, sessionManager, marshaller) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {SessionServiceConfig}
             */
            this.config             = sessionServiceConfig;

            /**
             * @private
             * @type {CookieParser}
             */
            this.cookieParser       = cookieParser;

            /**
             * @private
             * @type {CookieSigner}
             */
            this.cookieSigner       = cookieSigner;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller         = marshaller;

            /**
             * @private
             * @type {SessionManager}
             */
            this.sessionManager     = sessionManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {SessionServiceConfig}
         */
        getConfig: function() {
            return this.config;
        },

        /**
         * @return {CookieParser}
         */
        getCookieParser: function() {
            return this.cookieParser;
        },

        /**
         * @return {CookieSigner}
         */
        getCookieSigner: function() {
            return this.cookieSigner;
        },

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
        },

        /**
         * @return {SessionManager}
         */
        getSessionManager: function() {
            return this.sessionManager;
        },


        //-------------------------------------------------------------------------------
        // IBuildRequestContext Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {function(Throwable=)} callback
         */
        buildRequestContext: function(requestContext, callback) {
            var sessionId   = null;
            var request     = requestContext.getRequest();
            if (Class.doesExtend(request, IncomingRequest)) {
                sessionId       = request.getHandshake().sessionId;
            } else {
                sessionId       = request.sessionId;
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
         * @param {{
         *      headers: Object,
         *      time: Date,
         *      address: Object,
         *      xdomain: boolean,
         *      secure: boolean,
         *      issued: number,
         *      url: string,
         *      query: Object
         * }} handshakeData
         * @param {function(Throwable, boolean)} callback
         */
        shakeIt: function(handshakeData, callback) {
            console.log("SessionService#shakeIt");
            var sessionKey  = this.config.getSessionKey();
            if (handshakeData.headers.cookie) {

                //TEST
                console.log("handshakeData.headers.cookie:", handshakeData.headers.cookie);

                handshakeData.cookie        = this.cookieParser.parse(handshakeData.headers.cookie);

                //TEST
                console.log("handshakeData.cookie:", handshakeData.cookie);

                var sessionCookie = handshakeData.cookie[sessionKey];
                if (sessionCookie) {
                    handshakeData.sessionId     = this.cookieSigner.unsign(sessionCookie);

                    //TEST
                    console.log("handshakeData.sessionId:", handshakeData.sessionId);

                    callback(null, true);
                } else {
                    callback(new Exception("NoCookie", {}, "No cookie transmitted."), false);
                }
            } else {
                callback(new Exception("NoCookie", {}, "No cookie transmitted."), false);
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
            var originalHash    = null;
            var originalId      = null;
            var rawCookie       = req.cookies[sessionKey];
            var unsignedCookie  = req.signedCookies[sessionKey];
            if (!unsignedCookie && rawCookie) {
                unsignedCookie = this.cookieSigner.unsign(rawCookie);
            }

            // set-cookie
            res.on('header', function() {

                var session = req.requestContext.get("session");
                var cookie  = session.getCookie();
                var proto   = StringUtil.trim((req.headers['x-forwarded-proto'] || '').split(',')[0].toLowerCase());
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

                    if (null == cookie.getExpires()) {
                        if (!isNew) {
                            console.log('already set browser-session cookie');
                            return;
                        }
                    } else if (originalHash == _this.hashSession(session) && originalId == session.getSid()) {
                        console.log('unmodified session');
                        return;
                    }

                }

                var val = 's:' + _this.cookieSigner.sign(session.getSid());
                val = cookie.serialize(sessionKey, val);
                res.setHeader('Set-Cookie', val);
            });
            req.sessionId   = unsignedCookie;
            originalId      = req.sessionId;
            if (originalId) {
                this.sessionManager.retrieveSessionBySid(originalId, function(throwable, session) {
                    if (!throwable) {
                        if (session) {
                            originalHash = _this.hashSession(session);
                        }
                        next();
                    } else {
                        throw throwable;
                    }
                });
            } else {
                next();
            }
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
         * @param {function(Throwable, Session=)} callback
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
            if (!TypeUtil.isString(data.cookie.domain)) {
                var cookieDomain = this.config.getCookieDomain();
                if (!TypeUtil.isString(cookieDomain)) {
                    throw new Bug("IllegalConfig", {}, "CookieDomain was not setup properly. cookieDomain:", cookieDomain);
                }
                data.cookie.domain = this.config.getCookieDomain();
            }
            var session = this.sessionManager.generateSession(data);
            this.sessionManager.createSession(session, function(throwable) {
                if (!throwable) {
                    callback(null, session);
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
                    var data = session.getEntityData();
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
         * @param {function(Throwable, Session=)} callback
         */
        loadSessionBySid: function(sid, callback) {
            var _this   = this;
            var session = null;
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
                    callback(null, session);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, Set.<Session>=)} callback
         */
        retrieveSessionsByUserId: function(userId, callback) {
            this.sessionManager.retrieveSessionsByUserId(userId, callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Session} session
         * @return {String}
         */
        hashSession: function(session) {
            var cloneSession    = session.clone(true);
            delete cloneSession.cookie;
            var sessionJson     = this.marshaller.marshalData(cloneSession);
            return crc32.signed(sessionJson);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(SessionService, IBuildRequestContext);
    Class.implement(SessionService, IHand);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SessionService).with(
        module("sessionService")
            .args([
                arg().ref("sessionServiceConfig"),
                arg().ref("cookieParser"),
                arg().ref("cookieSigner"),
                arg().ref("sessionManager"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.SessionService', SessionService);
});
