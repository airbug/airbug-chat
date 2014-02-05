//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('PasswordUtil')
//@Require('Set')
//@Require('airbug.UserDefines')
//@Require('airbugserver.Github')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var bcrypt                  = require('bcrypt');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var PasswordUtil            = bugpack.require('PasswordUtil');
var Set                     = bugpack.require('Set');
var UserDefines             = bugpack.require('airbug.UserDefines');
var Github                  = bugpack.require('airbugserver.Github');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
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

    _constructor: function(logger, sessionManager, userManager, sessionService, airbugClientRequestPublisher, githubManager, userPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientRequestPublisher}
         */
        this.airbugClientRequestPublisher       = airbugClientRequestPublisher;

        /**
         * @private
         * @type {GithubManager}
         */
        this.githubManager                      = githubManager;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                             = logger;

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager                     = sessionManager;

        /**
         * @private
         * @type {SessionService}
         */
        this.sessionService                     = sessionService;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager                        = userManager;

        /**
         * @private
         * @type {UserPusher}
         */
        this.userPusher                         = userPusher;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AirbugClientRequestPublisher}
     */
    getAirbugClientRequestPublisher: function() {
        return this.airbugClientRequestPublisher;
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
        var user        = null;
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

    /*
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable)} callback
     */
    deleteUser: function(requestContext, userId, callback){
        //TODO
    },

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
     * @param {string} password
     * @param {function(Throwable, User=)} callback
     */
    loginUserWithEmailAndPassword: function(requestContext, email, password, callback) {
        var _this           = this;
        /** @type {User} */
        var user            = undefined;

        this.logger.debug("Starting user login via email and password - email:", email);
        $series([
            $task(function(flow) {
                _this.dbRetrieveUserByEmail(email, function(throwable, returnedUser) {
                    if (!throwable) {
                        if (returnedUser) {
                            _this.logger.debug("Found user with email - userId:", returnedUser.getId());
                            user = returnedUser;
                            flow.complete(throwable);
                        } else {
                            _this.logger.debug("There is no user by that email");
                            flow.complete(new Exception("NotFound"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow) {
                if (!password) {
                    _this.logger.debug("No password was given");
                    flow.complete(new Exception("InvalidPassword", {}, "No password was given"));
                } else if (!user.getPasswordHash()) {
                    _this.logger.warn("User does not have a password hash - userId:", user.getId());
                    flow.complete(new Bug("PasswordHashNotFound", {}, "User did not have a password hash"));
                } else {
                    bcrypt.compare(password, user.getPasswordHash(), function(err, res) {
                        if (err) {
                            flow.complete(err);
                        } else if (!res) {
                            _this.logger.info("Failed login for user. Incorrect password - userId:", user.getId());
                            flow.complete(new Exception("InvalidPassword", {}, "Could not login using given email and password"));
                        } else {
                            flow.complete();
                        }
                    });
                }
            }),
            $task(function(flow) {
                _this.loginUser(requestContext, user, function(throwable, user) {
                    if (!throwable) {
                        _this.logger.info("Successful login for user - userId:", user.getId());
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {User} user
     * @param {function(Throwable, User=)} callback
     */
    loginUser: function(requestContext, user, callback) {
        var _this           = this;
        var currentUser     = requestContext.get("currentUser");
        var session         = requestContext.get("session");


        this.logger.debug("Logging user in - userId:", user.getId());
        $series([
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
                _this.userPusher.unmeldUserWithEntity(currentUser, currentUser, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
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
        var _this                           = this;
        var airbugClientRequestPublisher    = this.airbugClientRequestPublisher;
        var session                         = requestContext.get("session");
        var currentUser                     = requestContext.get("currentUser");
        var sessionService                  = this.sessionService;
        var sessionSid                      = session.getSid();
        var data                            = requestContext.getRequest().body;
        var excludedCallUuids               = [];

        if (data) {
            if (data.callUuid) {
                excludedCallUuids.push(data.callUuid);
            }
        }

        this.logger.debug("Starting user logout - userId:", currentUser.getId(), " sessionSid:", sessionSid);
        $series([
            $task(function(flow) {
                sessionService.deleteSession(session, function(throwable){
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                sessionService.generateSession({}, function(throwable, generatedSession) {
                    if (!throwable) {
                        session = generatedSession;
                        requestContext.set("session", generatedSession);
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.ensureUserOnSession(session, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                airbugClientRequestPublisher.publishSessionRequest(sessionSid, "refreshConnectionForLogout", {}, excludedCallUuids, function(mappedThrowable, callResponseMap) {
                    flow.complete(mappedThrowable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      email: string
     *      firstName: string
     *      lastName: string
     *      password: string
     *      confirmPassword: string
     * }} formData
     * @param {function(Throwable, User=)} callback
     */
    registerUser: function(requestContext, formData, callback) {
        var _this       = this;
        var currentUser = requestContext.get("currentUser");
        var github      = null;
        var session     = requestContext.get("session");
        var user        = null;
        var userEmail   = formData.email;
        var userObject  = formData;

        $series([
            $task(function(flow) {
                _this.dbRetrieveUserByEmail(userEmail, function(throwable, user) {
                    if (!throwable) {
                        if (!user) {
                            flow.complete();
                        } else {
                            flow.complete(new Exception("UserExists", {}, "User already exists with that email"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }),
            $task(function(flow) {
                if (userObject.password !== userObject.confirmPassword) {
                    flow.complete(new Exception("PasswordMismatch", {}, "Password and confirmPassword must match"));
                } else if (!PasswordUtil.isValid(userObject.password)) {
                    flow.complete(new Exception("InvalidPassword", {}, "Invalid password"));
                } else {
                    userObject.status = currentUser.getStatus();
                    user = _this.userManager.generateUser(userObject);
                    bcrypt.genSalt(10, function(err, salt) {
                        if (err) {
                            flow.complete(err);
                        } else {
                            bcrypt.hash(userObject.password, salt, function(err, crypted) {
                                user.setPasswordHash(crypted);
                                flow.complete(err);
                            });
                        }
                    });
                }
            }),
            $task(function(flow) {
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
                _this.userPusher.unmeldUserWithEntity(currentUser, user, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var sessionData = session.getData();
                if (sessionData && sessionData.githubAuthToken) {
                    github = new Github({
                        userId: user.id,
                        githubAuthCode: sessionData.githubAuthToken,
                        githubId: sessionData.githubId,
                        githubLogin: sessionData.githubLogin
                    });
                    github.setUser(user);
                    _this.githubManager.createGithub(github, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                if (github) {
                    var sessionData = session.getData();
                    delete sessionData.githubId;
                    delete sessionData.githubAuthToken;
                    delete sessionData.githubLogin;
                    delete sessionData.githubState;
                    _this.sessionManager.updateSession(session, function(throwable, session) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }

            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {function(Throwable, User=)} callback
     */
    retrieveCurrentUser: function(requestContext, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var call         = requestContext.get("call");

        this.logger.debug("Starting retrieveCurrentUser - currentUser.getId():", currentUser.getId());
        $series([
            $task(function(flow) {
                _this.userPusher.meldCallWithUser(call.getCallUuid(), currentUser, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userPusher.pushUserToCall(currentUser, call.getCallUuid(), function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, currentUser);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, User=)} callback
     */
    retrieveUser: function(requestContext, userId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var call                = requestContext.get("call");
        /** @type {User} */
        var user                = null;

        this.logger.debug("Starting retrieveUser - userId:", userId);
        $series([
            $task(function(flow) {
                _this.dbRetrieveUser(userId, function(throwable, returnedUser){
                    if (!throwable) {
                        if (returnedUser) {
                            user = returnedUser;
                            flow.complete();
                        } else {
                            flow.error(new Exception("NotFound"));
                        }
                    } else {
                        flow.error(throwable);
                    }
                });
            }),
            $task(function(flow) {
                _this.userPusher.meldCallWithUser(call.getCallUuid(), user, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userPusher.pushUserToCall(user, call.getCallUuid(), function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} userIds
     * @param {function(Throwable, Map.<string, User>=)} callback
     */
    retrieveUsers: function(requestContext, userIds, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var call         = requestContext.get("call");
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
                _this.userPusher.meldCallWithUsers(call.getCallUuid(), userMap.getValueArray(), function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userPusher.pushUsersToCall(userMap.getValueArray(), call.getCallUuid(), function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, userMap);
            } else {
                callback(throwable);
            }
        });
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {{*}} updates
     * @param {function(Throwable, User)} callback
     */
    updateUser: function(requestContext, userId, updates, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var call         = requestContext.get("call");
        /** @type {User} */
        var user                = null;

        $series([
            $task(function(flow) {
                _this.dbRetrieveUser(userId, function(throwable, returnedUser){
                    if (!throwable) {
                        if (returnedUser) {
                            if (returnedUser.getId() === userId) {
                                user = returnedUser;
                                flow.complete();
                            } else {
                                flow.error(new Exception("UnauthorizedAccess"));
                            }
                        } else {
                            flow.error(new Exception("NotFound"));
                        }
                    } else {
                        flow.error(throwable);
                    }
                });
            }),
            $task(function(flow) {
                if (Obj.hasProperty(updates, "email")) {
                    user.setEmail(updates.email);
                }
                if (Obj.hasProperty(updates, "firstName")) {
                    user.setFirstName(updates.firstName);
                }
                if (Obj.hasProperty(updates, "lastName")) {
                    user.setLastName(updates.lastName);
                }
                if (Obj.hasProperty(updates, "status")) {
                    user.setStatus(updates.status);
                }
                _this.userManager.updateUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userPusher.meldCallWithUser(call.getCallUuid(), user, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userPusher.pushUser(user, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
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
     * @param {function(Throwable, User=)} callback
     */
    createAnonymousUser: function(callback) {
        var userManager     = this.userManager;
        var user            = userManager.generateUser({
            anonymous: true,
            status: UserDefines.Status.OFFLINE
        });
        userManager.createUser(user, function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {Session} session
     * @param {function(Throwable, User=)} callback
     */
    createAnonymousUserAndSaveToSession: function(session, callback) {
        var _this   = this;
        /** @type {User} */
        var user    = null;

        $series([
            $task(function(flow) {
                _this.createAnonymousUser(function(throwable, createdUser) {
                    if (!throwable) {
                        user = createdUser;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                session.setUserId(user.getId());
                _this.sessionManager.updateSession(session, function(throwable, session) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {Session} session
     * @param {function(Throwable, User=)} callback
     */
    ensureUserOnSession: function(session, callback) {
        this.logger.debug("Ensuring user on session");
        if (session.getUserId()) {
            this.retrieveUserAndSaveToSession(session, callback);
        } else {
            this.createAnonymousUserAndSaveToSession(session, callback);
        }
    },

    /**
     * @private
     * @param {Session} session
     * @param {function(Throwable, User=)} callback
     */
    retrieveUserAndSaveToSession: function(session, callback) {
        var _this   = this;
        /** @type {User} */
        var user    = null;
        $series([
            $task(function(flow) {
                _this.userManager.retrieveUser(session.getUserId(), function(throwable, retrievedUser) {
                    if (!throwable) {
                        user = retrievedUser;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                if (!user) {
                    session.setUserId(undefined);
                    _this.createAnonymousUser(function(throwable, createdUser) {
                        if (!throwable) {
                            user = createdUser;
                        }
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                session.setUserId(user.getId());
                _this.sessionManager.updateSession(session, function(throwable, session) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, user);
            } else {
                callback(throwable);
            }
        });
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
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserService, IBuildRequestContext);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserService).with(
    module("userService")
        .args([
            arg().ref("logger"),
            arg().ref("sessionManager"),
            arg().ref("userManager"),
            arg().ref("sessionService"),
            arg().ref("airbugClientRequestPublisher"),
            arg().ref("githubManager"),
            arg().ref("userPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);
