//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.IPreProcessRequest')
//@Require('bugcall.IProcessRequest')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var IPreProcessRequest  = bugpack.require('bugcall.IPreProcessRequest');
var IProcessRequest     = bugpack.require('bugcall.IProcessRequest');
var IHand               = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;
var $iterableParallel   = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager, userManager, meldService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldService}
         */
        this.meldService            = meldService;

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager         = sessionManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager            = userManager;
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

        //TODO BRN (QUESTION): When a session is regenerated, does it automatically rerun the authorization (handshake.shakeIt) call
        console.log("UserService#shakeIt");
        var _this = this;
        if (handshakeData.session) {
            var session = handshakeData.session;
            console.log("session:");
            if(session) console.log("true");
            if(!session) console.log("false");
            //TODO
            if(!session.data) session.data = {};
            //
            if (session.data.userId) {
                this.userManager.retrieveUser(session.data.userId, function(throwable, user) {
                    console.log("userManager.retrieveUser. user:", user);
                    if (!throwable) {
                        if (user) {
                            handshakeData.user = user;
                            console.log("Finish UserService shake userManager retrieveUser if !throwable && user");
                            console.log("throwable:", throwable);
                            callback(throwable, true);
                        } else {
                            delete session.data.userId;
                            _this.createAnonymousUser(function(throwable, user) {
                                if (!throwable) {
                                    handshakeData.user = user;
                                    session.data.userId = user.id;
                                    session.save(function(throwable, session) {
                                        console.log("Finish UserService shake createAnonymousUser callback session save");
                                        console.log("throwable:", throwable);
                                        callback(throwable, true);
                                    });
                                } else {
                                    console.log("Finish UserService shake createAnonymousUser callback throwable");
                                    console.log("throwable:", throwable);
                                    callback(throwable, false);
                                }
                            });
                        }
                    } else {
                        console.log("Finish UserService shake userManager retrieveUser throwable");
                        console.log("throwable:", throwable);
                        callback(throwable, false);
                    }
                });
            } else {
                //TODO
                this.createAnonymousUser(function(throwable, user) {
                    if (!throwable) {
                        handshakeData.user = user;
                        session.data.userId = user.id;
                        session.save(function(throwable, session) {
                            console.log("Finish UserService shake createAnonymousUser 2 callback session save");
                            console.log("throwable:", throwable);
                            callback(throwable, true);
                        });
                    } else {
                        console.log("Finish UserService shake createAnonymousUser 2 callback throwable");
                        console.log("throwable:", throwable);
                        callback(throwable, false);
                    }
                });
                // callback(new Error('No userId associated with sessionManager'), false);
            }
        } else {
            console.log("Finish UserService shake");
            callback(new Error('No session has been generated.'), false);
        }
    },

    //-------------------------------------------------------------------------------
    // IPreProcess Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)}  callback
     */
    preProcessRequest: function(request, responder, callback) {
        console.log("Inside UserService#preProcessRequest");
        var handshake   = request.getHandshake();
        var session     = handshake.session;
        if(!session.data.userId){
            this.createAnonymousUser(function(throwable, user){
                console.log("Inside UserService#preProcessRequest createAnonymousUser callback");
                if(user && !throwable) {
                    session.data.userId = user.getId();
                    session.save(function(throwable, session){
                        console.log("Finish preProcessRequest");
                        callback(throwable);
                    });
                }
                console.log("Finish preProcessRequest");
                callback(throwable);
            })
        } else {
            console.log("Finish preProcessRequest");
            callback();
        }
    },


    //-------------------------------------------------------------------------------
    // IProcess Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)}  callback
     */
    // processRequest: function(request, responder, callback) {

    // },

    //-------------------------------------------------------------------------------
    // Express Middleware User Check
    //-------------------------------------------------------------------------------

    checkRequestForUser: function(req, res, next){
        if(!req.session.data) req.session.data = {};
        if(!req.session.data.userId){
            this.createAnonymousUser(function(throwable, user){
                req.session.data.userId = user.getId();
                req.session.save(function(error){
                    console.log("Finish checkRequestForUser");
                    next(error);
                });
            });
        } else {
            console.log("Finish checkRequestForUser");
            next();
        }
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    findUserByEmail: function(email, callback){
        this.userManager.retrieveUserByEmail(email, callback);
        //NOTE: This call does not require melding
    },

    /**
     * @param {string} id
     * @param {function(Throwable, User)} callback
     */
    findUserById: function(id, callback){
        this.userManager.retrieveUser(id, callback);
        //NOTE: This call does not require melding
    },


    /**
     * @param {Express.request} request
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    loginUser: function(request, email, callback) {
        var _this           = this;
        var currentUser     = undefined;
        var currentUserId   = request.session.data.userId;
        var meldManager     = this.meldService.factoryManager();
        var user            = undefined;
        var userManager     = this.userManager;
        console.log("UserService#loginUser");
        console.log("currentUserId:", currentUserId);
        $series([
            $task(function(flow){
                _this.dbRetrieveUser(currentUserId, function(throwable, returnedUser){
                    console.log("dbRetrieveUser throwable:", throwable);
                    if (!throwable) {
                        if (returnedUser) {
                            currentUser = returnedUser;
                            console.log("currentUser:", returnedUser);
                            console.log("right before userManager#populateUser");
                            userManager.populateUser(currentUser, ["roomSet"], function(throwable) {
                                flow.complete(throwable);
                            });
                        } else {
                            flow.complete(new Exception("NotFound"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow){
                _this.dbRetrieveUserByEmail(email, function(throwable, returnedUser) {
                    console.log("dbRetrieveUserByEmail throwable:", throwable);
                    if (!throwable) {
                        if (returnedUser) {
                            user = returnedUser;
                            console.log("right before userManager#populateUser");
                            userManager.populateUser(user, ["roomSet"], function(throwable) {
                                flow.complete(throwable);
                            });
                        } else {
                            flow.complete(new Exception("NotFound"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow) {
                //unmeld anonymous user
                _this.meldService.unmeldEntity(meldManager, "User", "owner", currentUser);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, currentUser);
                //meld logged in user
                _this.meldService.meldEntity(meldManager, "User", "owner", user);
                _this.meldCurrentUserWithCurrentUser(meldManager, user, user);
                meldManager.commitTransaction(function(throwable) {
                    console.log("commitTransaction:", throwable);
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            console.log("throwable:", throwable);
            if (!throwable) {
                callback(throwable);
            } else {
                callback(undefined, user);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      email: string
     *      firstName: string
     *      lastName: string
     * }} formData
     * @param {function(Throwable, User)} callback
     */
    registerUser: function(requestContext, formData, callback) {
        var _this       = this;
        var meldManager = this.meldService.factoryManager();
        var user        = undefined;
        var userEmail   = formData.email;

        $series([
            $task(function(flow){
                _this.dbRetrieveUserByEmail(userEmail, function(throwable, user){
                    if(!throwable){
                        if(!user){
                            user = _this.userManager.generateUser(userObject);
                            _this.userManager.createUser(user, function(throwable){
                                flow.complete(throwable);
                            });
                        } else {
                            flow.complete(new Error("User already exists"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow){
                //unmeld anonymous user
                _this.meldService.unmeldEntity(meldManager, "User", "owner", user);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, user);
                //meld registered user
                _this.meldService.meldEntity(meldManager, "User", "owner", user);
                _this.meldCurrentUserWithCurrentUser(meldManager, user, user);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable, user);
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {RequestContext} requestContext
     * @param {function(Throwable)} callback
     */
    retrieveCurrentUser: function(requestContext, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var userManager         = this.userManager;

        $series([
            $task(function(flow){
                //NOTE: SUNG Should anything beyond the rooms be populated??
                userManager.populateUser(currentUser, function(throwable){
                    flow.complete(throwable)
                });
            }),
            $task(function(flow) {
                _this.meldService.meldEntity(meldManager, "User", "owner", currentUser);
                _this.meldCurrentUserWithCurrentUser(meldManager, currentUser, currentUser);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, currentUser);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, *)} callback
     */
    retrieveUser: function(requestContext, userId, callback){
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var userManager         = this.userManager;
        var user                = undefined;

        $series([
            $task(function(flow){
                _this.dbRetrieveUser(userId, function(throwable, returnedUser){
                    user = returnedUser;
                });
            }),
            $task(function(flow) {
                _this.meldService.meldEntity(meldManager, "User", "basic", user);
                _this.meldUserWithCurrentUser(meldManager, user, currentUser);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} userIds
     * @param {function(Throwable, Map.<string, User>)} callback
     */
    retrieveUsers: function(requestContext, userIds, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var userManager         = this.userManager;
        var userMap             = undefined;

        $series([
            $task(function(flow){
                _this.dbRetrieveUsers(userId, function(throwable, returnedUserMap){
                    if (!throwable) {
                        userMap = returnedUserMap;
                        if (!userMap) {
                            throwable = new Exception(""); //TODO
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                userMap.getValueCollection().forEach(function(user){
                    _this.meldService.meldEntity(meldManager, "User", "basic", user);
                    _this.meldUserWithCurrentUser(meldManager, user, currentUser);
                });
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, userMap);
            } else {
                callback(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Throwable, User)} callback
     */
    createAnonymousUser: function(callback) {
        var _this       = this;
        var meldManager = this.meldService.factoryManager();
        var user        = undefined;
        var userManager = this.userManager;
        $series([
            $task(function(flow){
                user = userManager.generateUser({anonymous: true});
                userManager.createUser(user, function(throwable){
                    if(throwable) console.log("1throwable:", throwable);
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                console.log("meldManager:");
                if(meldManager) console.log("true");
                console.log("user:");
                if(user) console.log("true");
                try{
                    _this.meldService.meldEntity(meldManager, "User", "owner", user);
                } catch(error){
                    console.log("Error in meldService.meldEntity");
                }
                try{
                    _this.meldCurrentUserWithCurrentUser(meldManager, user);
                } catch(error){
                    console.log("Error in meldCurrentUserWithCurrentUser");
                }

                meldManager.commitTransaction(function(throwable) {
                    if(throwable) console.log("2throwable:", throwable);
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            if(throwable) console.log("3throwable:", throwable);
            callback(throwable, user);
        });
    },


    // Private Database Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUser: function(userId, callback){
        this.userManager.retrieveUser(userId, callback);
    },

    /**
     * @private
     * @param {Array.<string>} userIds
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUsers: function(userIds, callback){
        this.userManager.retrieveUsers(userIds, callback);
    },

    /**
     * @private
     * @param {string} userEmail
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUserByEmail: function(userEmail, callback){
        this.userManager.retrieveUserByEmail(userEmail, callback);
    },

    /**
     * @private
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    dbRetrievePopulatedUser: function(userId, callback){
        var user        = undefined;
        var userManager = this.userManager;
        $series([
            $task(function(flow){
                userManager.retrieveUser(userId, function(throwable, returnedUser){
                    if(!throwable){
                        user = returnedUser;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                userManager.populateUser(user, function(throwable){
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable, user);
        });
    },

    // Private Meld Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    meldUserWithCurrentUser: function(meldManager, user, currentUser) {
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var reason = ""; //TODO
        this.meldService.meldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    meldCurrentUserWithCurrentUser: function(meldManager, currentUser) {
        console.log("Inside UserService#meldCurrentUserWithCurrentUser");
        var userMeldKey = this.meldService.generateMeldKey("User", currentUser.getId(), "owner");
        var reason = ""; //TODO
        this.meldService.meldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    unmeldUserFromCurrentUser: function(meldManager, user, currentUser) {
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var reason = ""; //TODO
        this.meldService.unmeldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    unmeldCurrentUserFromCurrentUser: function(meldManager, user, currentUser) {
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "owner");
        var reason = ""; //TODO
        this.meldService.unmeldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserService, IHand);
Class.implement(UserService, IPreProcessRequest);
// Class.implement(UserService, IProcessRequest);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);
