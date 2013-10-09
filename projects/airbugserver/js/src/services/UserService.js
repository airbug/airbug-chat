//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Obj')
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
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');
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

    _constructor: function(sessionManager, userManager) {

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
        this.sessionManager = sessionManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager    = userManager;
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {} handshakeData
     * @param {function(Error, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {

        //TODO BRN (QUESTION): When a session is regenerated, does it automatically rerun the authorization (handshake.shakeIt) call
        console.log("UserService#shakeIt");
        var _this = this;
        if (handshakeData.session) {
            var session = handshakeData.session;
            console.log("session:", session);
            if (session.data.userId) {
                this.userManager.retrieveUser(session.data.userId, function(throwable, user) {
                    console.log("userManager.retrieveUser. user:", user);
                    if (!throwable) {
                        if (user) {
                            handshakeData.user = user;
                            callback(throwable);
                        } else {
                            delete session.data.userId;
                            _this.createAnonymousUser(function(throwable, user) {
                                if (!throwable) {
                                    handshakeData.user = user;
                                    session.data.userId = user.id;
                                    session.save(function(throwable, session){
                                        callback(throwable);
                                    });
                                } else {
                                    callback(throwable);
                                }
                            });
                        }
                    } else {
                        callback(throwable);
                    }
                });
            } else {
                this.createAnonymousUser(function(throwable, user) {
                    if (!throwable) {
                        handshakeData.user = user;
                        session.data.userId = user.id;
                        session.save(function(throwable, user){
                            callback(throwable);
                        });
                    } else {
                        callback(throwable);
                    }
                });
            }
        } else {
            callback(new Error('No session has been generated.'), false);
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
     * @param {RequestContext} requestContext
     * @param {{
     *      email: string
     * }} formData     * @param {function(Throwable, User)} callback
     */
     //TODO SUNG: If possible, refactor so that req does not need to be passed in here
    loginUser: function(requestContext, req, formData, callback){
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var session             = requestContext.get("session");
        var user                = undefined;
        var userManager         = this.userManager;
        var userEmail           = formData.email;

        $series([
            $task(function(flow){
                _this.dbRetrieveUserByEmail(userEmail, function(throwable, returnedUser){
                    if(!throwable){
                        if(returnedUser){
                            user = returnedUser;
                            userManager.populateUser(user, function(throwable){
                                flow.complete(throwable);
                            });
                        } else {
                            flow.complete(new Error("User does not exists"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow){
                //unmeld anonymous user
                _this.meldService.unmeldEntity(meldManager, "User", "owner", currentUser);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, currentUser);
                //meld logged in user
                _this.meldService.meldEntity(meldManager, "User", "owner", user);
                _this.meldCurrentUserWithCurrentUser(meldManager, user, user);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                _this.sessionService.regenerateSession(session.getId(), req, user, function(throwable){
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable){
            callback(throwable, user);
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
     //TODO SUNG: If possible, refactor so that req does not need to be passed in here
    registerUser: function(requestContext, req, formData, callback) {
        var _this       = this;
        var currentUser = requestContext.get("currentUser");
        var meldManager = this.meldService.factoryManager();
        var session     = requestContext.get("session");
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
                _this.meldService.unmeldEntity(meldManager, "User", "owner", currentUser);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, currentUser);
                //meld registered user
                _this.meldService.meldEntity(meldManager, "User", "owner", user);
                _this.meldCurrentUserWithCurrentUser(meldManager, user, user);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
                _this.sessionService.regenerateSession(session.getId(), req, user, function(throwable){
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
                    flow.complete(throwable);
                });
            }),
            $task(function(flow){
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
    dbRetrieveUser: function(userIds, callback){
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
    meldUserWithCurrentUser: function(meldManager, user, currentUser){
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
    meldCurrentUserWithCurrentUser: function(meldManager, currentUser){
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "owner");
        var reason = ""; //TODO
        this.meldService.meldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    unmeldUserFromCurrentUser: function(meldManager, user, currentUser){
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
    unmeldCurrentUserFromCurrentUser: function(meldManager, user currentUser){
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "owner");
        var reason = ""; //TODO
        this.meldService.unmeldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserService, IHand);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);
