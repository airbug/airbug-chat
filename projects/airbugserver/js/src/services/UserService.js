//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
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
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager, userManager, meldService, sessionService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.counter = 0;

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

        /**
         * @private
         * @type {SessionService}
         */
        this.sessionService         = sessionService;
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
        var user        = undefined;
        $series([
            $task(function(flow) {
                _this.ensureUserOnSession(session, function(throwable, returnedUser) {
                    if (!throwable) {
                        user = returnedUser;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                 _this.userManager.populateUser(user, ["sessionSet"], function(throwable) {
                     flow.complete(throwable);
                 });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                requestContext.set("currentUser", user);
            }
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    findUserByEmail: function(email, callback) {
        this.userManager.retrieveUserByEmail(email, callback);
        //NOTE: This call does not require melding
    },

    /**
     * @param {string} id
     * @param {function(Throwable, User)} callback
     */
    findUserById: function(id, callback) {
        this.userManager.retrieveUser(id, callback);
        //NOTE: This call does not require melding
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    loginUser: function(requestContext, email, callback) {
        console.log("Inside UserService#login");
        var _this           = this;
        var currentUser     = requestContext.get("currentUser");
        var session         = requestContext.get("session");
        var meldManager     = this.meldService.factoryManager();
        var user            = undefined;

        console.log("UserService#loginUser ");
        $series([
            $task(function(flow) {
                _this.dbRetrieveUserByEmail(email, function(throwable, returnedUser) {
                    console.log("dbRetrieveUserByEmail throwable:", throwable);
                    if (!throwable) {
                        if (returnedUser) {
                            console.log("dbRetrieveUserByEmail returnedUserId:", returnedUser.getId());

                            user = returnedUser;
                            flow.complete(throwable);
                        } else {
                            console.log("There is no user by that email");
                            flow.complete(new Exception("NotFound"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow) {
                _this.sessionService.regenerateSession(session, function(throwable, generatedSession) {
                    if (!throwable) {
                        session = generatedSession;
                        requestContext.set("session", generatedSession);
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                session.setUserId(user.getId());
                _this.sessionManager.updateSession(session, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                //unmeld anonymous user
                _this.meldService.unmeldEntity(meldManager, "User", "owner", currentUser);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, currentUser);

                // NOTE BRN: We don't try to meld the logged in user here. Instead we depend on the client side to make
                // another request to retrieve the current user

                meldManager.commitTransaction(function(throwable) {
                    console.log("commitTransaction throwable:", throwable);
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            console.log("UserService#login execute series callback");
            if (!throwable) {
                console.log("userId:", user.getId());
                callback(undefined, user);
            } else {
                console.log("UserService#loginUser throwable:", throwable);
                callback(throwable);
            }
        });

        //TODO: find all call connections related to the oldSid and send them a refreshConnectionForLogin request
        // Make sure there are no issues with client-side initiated disconnect.
    },

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable)} callback
     */
    logoutUser: function(requestContext, callback) {
        var session = requestContext.get("session");
        this.sessionService.deleteSession(session, function(throwable) {
            callback(throwable);
        });

        // find all callconnections related to the oldSid and send them a refreshConnectionForLogout request

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
        var currentUser = requestContext.get("currentUser");
        var meldManager = this.meldService.factoryManager();
        var session     = requestContext.get("session");
        var user        = undefined;
        var userEmail   = formData.email;
        var userObject  = formData;

        $series([
            $task(function(flow) {
                _this.dbRetrieveUserByEmail(userEmail, function(throwable, user) {
                    if (!throwable) {
                        if (!user) {
                            flow.complete();
                        } else {
                            flow.complete(new Exception("UserExists"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow) {
                user = _this.userManager.generateUser(userObject);
                _this.userManager.createUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.sessionService.regenerateSession(session, function(throwable, generatedSession) {
                    if (!throwable) {
                        session = generatedSession;
                        requestContext.set("session", generatedSession);
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                session.setUserId(user.getId());
                _this.sessionManager.updateSession(session, function(throwable) {
                    requestContext.set("currentUser", user);
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.meldService.unmeldEntity(meldManager, "User", "owner", user);
                _this.unmeldCurrentUserFromCurrentUser(meldManager, currentUser, user);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            callback(throwable, user);
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable)} callback
     */
    retrieveCurrentUser: function(requestContext, callback) {

        console.log("UserService#retrieveCurrentUser");
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        //var userManager         = this.userManager;

        //TEST
        console.log("UserService#retrieveCurrentUser - currentUser.getId():", currentUser.getId());
        $series([
            /*$task(function(flow) {
                //NOTE: SUNG Should anything beyond the rooms be populated??
                userManager.populateUser(currentUser, ["roomSet"], function(throwable){
                    flow.complete(throwable)
                });
            }),*/
            $task(function(flow) {
                _this.meldCurrentUserWithCurrentUser(meldManager, currentUser);
                _this.meldService.meldEntity(meldManager, "User", "owner", currentUser);
                meldManager.commitTransaction(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {

            console.log("AFTER UserService#retrieveCurrentUser - throwable", currentUser.getId());
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
    retrieveUser: function(requestContext, userId, callback) {
        console.log("UserService#retrieveUser");
        console.log("userId:", userId);
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var userManager         = this.userManager;
        var user                = undefined;

        $series([
            $task(function(flow) {
                console.log("before dbRetrieveUser");
                _this.dbRetrieveUser(userId, function(throwable, returnedUser) {
                    user = returnedUser;
                    console.log("returnedUser", returnedUser);
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                console.log("Before meld");

                if (user && currentUser) {
                    _this.meldService.meldEntity(meldManager, "User", "basic", user); //BUG
                    _this.meldUserWithCurrentUser(meldManager, user, currentUser);
                    meldManager.commitTransaction(function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete(new Exception()); //TODO
                }

            })
        ]).execute(function(throwable) {
            console.log("UserService#retrieveUser execute callback");
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
            $task(function(flow) {
                _this.dbRetrieveUsers(userIds, function(throwable, returnedUserMap) {
                    if (!throwable) {
                        userMap = returnedUserMap;
                        if (!userMap) {
                            throwable = new Exception(""); //TODO
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                userMap.getValueCollection().forEach(function(user) {
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
        console.log("Inside UserService#createAnonymousUser");
        var userManager     = this.userManager;
        var user            = userManager.generateUser({anonymous: true});
        userManager.createUser(user, function(throwable) {
            if (!throwable) {
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {Session} session
     * @param {function(Throwable, User)} callback
     */
    ensureUserOnSession: function(session, callback) {
        console.log("Inside UserService#ensureUserOnSession");
        var _this = this;
        if (session.getUserId()) {
            this.userManager.retrieveUser(session.getUserId(), function(throwable, user) {
                if (!throwable) {
                    if (user) {
                        callback(undefined, user);
                    } else {
                        session.setUserId(undefined);
                        _this.createAnonymousUser(function(throwable, user) {
                            if (!throwable) {
                                session.setUserId(user.getId());
                                _this.sessionManager.updateSession(session, function(throwable) {
                                    console.log("Finish UserService ensureUserOnSession createAnonymousUser callback session save");
                                    console.log("throwable:", throwable);
                                    if (!throwable) {
                                        callback(undefined, user);
                                    } else {
                                        callback(throwable);
                                    }
                                });
                            } else {
                                console.log("Finish UserService ensureUserOnSession createAnonymousUser callback throwable");
                                console.log("throwable:", throwable);
                                callback(throwable);
                            }
                        });
                    }
                } else {
                    console.log("Finish UserService ensureUserOnSession userManager retrieveUser throwable");
                    console.log("throwable:", throwable);
                    callback(throwable);
                }
            });
        } else {
            this.createAnonymousUser(function(throwable, user) {
                console.log("Inside UserService#ensureUserOnSession createAnonymousUser callback");
                console.log("throwable:", throwable);
                // console.log("user:", user);
                console.log("session.getData():", session.getData());
                if (!throwable) {
                    session.setUserId(user.getId());
                    _this.sessionManager.updateSession(session, function(throwable, session) {
                        console.log("Finish UserService ensureUserOnSession createAnonymousUser 2 callback session save");
                        console.log("throwable:", throwable);
                        console.log("session.getData():", session.getData()); //BUG userId was not updated //was updated
                        if (!throwable) {
                            callback(undefined, user);
                        } else {
                            callback(throwable);
                        }
                    });
                } else {
                    console.log("Finish UserService ensureUserOnSession createAnonymousUser 2 callback throwable");
                    console.log("throwable:", throwable);
                    callback(throwable);
                }
            });
        }
    },


    // Private Database Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUser: function(userId, callback) {
        this.userManager.retrieveUser(userId, callback);
    },

    /**
     * @private
     * @param {Array.<string>} userIds
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUsers: function(userIds, callback) {
        this.userManager.retrieveUsers(userIds, callback);
    },

    /**
     * @private
     * @param {string} userEmail
     * @param {function(Throwable, User)} callback
     */
    dbRetrieveUserByEmail: function(userEmail, callback) {
        this.userManager.retrieveUserByEmail(userEmail, callback);
    },

    /**
     * @private
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    dbRetrievePopulatedUser: function(userId, callback) {
        var user        = undefined;
        var userManager = this.userManager;
        $series([
            $task(function(flow) {
                userManager.retrieveUser(userId, function(throwable, returnedUser) {
                    if (!throwable) {
                        user = returnedUser;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                userManager.populateUser(user, ["roomSet"], function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
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
     * @param {User} currentUser
     */
    meldCurrentUserWithCurrentUser: function(meldManager, currentUser) {
        console.log("Inside UserService#meldCurrentUserWithCurrentUser");
        var userMeldKey = this.meldService.generateMeldKey("User", currentUser.getId(), "owner");
        var reason = "currentUser"; //TODO
        this.meldService.meldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    unmeldUserFromCurrentUser: function(meldManager, user, currentUser) {
        console.log("Inside UserService#unmeldUserFromCurrentUser");
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "basic");
        var reason = "currentUser"; //TODO
        this.meldService.unmeldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    },

    /**
     * @private
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {User} currentUser
     */
    unmeldCurrentUserFromCurrentUser: function(meldManager, user, currentUser) {
        console.log("Inside UserService#unmeldCurrentUserFromCurrentUser");
        var userMeldKey = this.meldService.generateMeldKey("User", user.getId(), "owner");
        var reason = ""; //TODO
        this.meldService.unmeldUserWithKeysAndReason(meldManager, currentUser, [userMeldKey], reason);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserService, IBuildRequestContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);
