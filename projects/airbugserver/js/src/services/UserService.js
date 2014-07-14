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

//@Export('airbugserver.UserService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('airbug.PasswordUtil')
//@Require('airbug.UserDefines')
//@Require('airbugserver.Github')
//@Require('Flows')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugrequest.IBuildRequestContext')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var bcrypt                  = require('bcrypt');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Obj                     = bugpack.require('Obj');
    var Set                     = bugpack.require('Set');
    var PasswordUtil            = bugpack.require('airbug.PasswordUtil');
    var UserDefines             = bugpack.require('airbug.UserDefines');
    var Github                  = bugpack.require('airbugserver.Github');
    var Flows                 = bugpack.require('Flows');
    var ArgTag           = bugpack.require('bugioc.ArgTag');
    var ModuleTag        = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var IBuildRequestContext    = bugpack.require('bugrequest.IBuildRequestContext');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IBuildRequestContext}
     */
    var UserService = Class.extend(Obj, {

        _name: "airbugserver.UserService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {SessionManager} sessionManager
         * @param {UserManager} userManager
         * @param {SessionService} sessionService
         * @param {AirbugClientRequestPublisher} airbugClientRequestPublisher
         * @param {GithubManager} githubManager
         * @param {UserPusher} userPusher
         * @param {BetaKeyService} betaKeyService
         * @param {ActionManager} actionManager
         * @param {AirbugServerConfig} airbugServerConfig
         */
        _constructor: function(logger, sessionManager, userManager, sessionService, airbugClientRequestPublisher, githubManager, userPusher, betaKeyService, actionManager, airbugServerConfig) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ActionManager}
             */
            this.actionManager                      = actionManager;

            /**
             * @private
             * @type {AirbugClientRequestPublisher}
             */
            this.airbugClientRequestPublisher       = airbugClientRequestPublisher;

            /**
             * @private
             * @type {AirbugServerConfig}
             */
            this.airbugServerConfig                 = airbugServerConfig;

            /**
             * @private
             * @type {BetaKeyService}
             */
            this.betaKeyService                     = betaKeyService;

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
         * @return {ActionManager}
         */
        getActionManager: function() {
            return this.actionManager;
        },

        /**
         * @return {AirbugClientRequestPublisher}
         */
        getAirbugClientRequestPublisher: function() {
            return this.airbugClientRequestPublisher;
        },

        /**
         * @return {AirbugServerConfig}
         */
        getAirbugServerConfig: function() {
            return this.airbugServerConfig
        },

        /**
         * @return {BetaKeyService}
         */
        getBetaKeyService: function() {
            return this.betaKeyService;
        },

        /**
         * @return {GithubManager}
         */
        getGithubManager: function() {
            return this.githubManager;
        },

        /**
         * @return {Logger}
         */
        getLogger: function() {
            return this.logger;
        },

        /**
         * @return {SessionManager}
         */
        getSessionManager: function() {
            return this.sessionManager;
        },

        /**
         * @return {SessionService}
         */
        getSessionService: function() {
            return this.sessionService;
        },

        /**
         * @return {UserManager}
         */
        getUserManager: function() {
            return this.userManager;
        },

        /**
         * @return {UserPusher}
         */
        getUserPusher: function() {
            return this.userPusher;
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
        // Service Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {RequestContext} requestContext
         * @param {string} userId
         * @param {function(Throwable)} callback
         */
        deleteUser: function(requestContext, userId, callback) {
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
                    _this.verifyPasswordMatch(password, user, function(throwable, result) {
                        if (!throwable) {
                            if (!result) {
                                _this.logger.info("Failed login for user. Incorrect password - userId:", user.getId());
                                flow.complete(new Exception("InvalidPassword", {}, "Could not login using given email and password"));
                            } else {
                                flow.complete();
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
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
         * @param {function(Throwable=)} callback
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
                })
            ]).execute(function(throwable) {
                if (!throwable) {

                    //NOTE BRN:
                    callback();
                    $task(function(flow) {
                        airbugClientRequestPublisher.publishSessionRequest(sessionSid, "refreshConnectionForLogout", {}, excludedCallUuids, function(mappedThrowable, callResponseMap) {
                            flow.complete(mappedThrowable);
                        });
                    }).execute(function(throwable) {
                        if (throwable) {
                            _this.logger.error(throwable);
                        }
                    })
                } else {
                    callback(throwable);
                }
            });
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
            console.log("requestContext:", requestContext);
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
                    userObject.status               = currentUser.getStatus();
                    userObject.agreedToTermsDate    = UserDefines.TOS_Date;
                    userObject.anonymous            = false;
                    if (userObject.password !== userObject.confirmPassword) {
                        flow.complete(new Exception("PasswordMismatch", {}, "Password and confirmPassword must match"));
                    } else if (!PasswordUtil.isValid(userObject.password)) {
                        flow.complete(new Exception("InvalidPassword", {}, "Invalid password"));
                    } else {
                        user = _this.userManager.generateUser(userObject);
                        _this.generatePasswordHash(userObject.password, function(throwable, passwordHash) {
                            if (!throwable) {
                                user.setPasswordHash(passwordHash);
                            }
                            flow.complete(throwable);
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
                    if (sessionData && sessionData.getGithubAuthToken()) {
                        github = new Github({
                            userId: user.id,
                            githubAuthCode: sessionData.getGithubAuthToken(),
                            githubId: sessionData.getGithubId(),
                            githubLogin: sessionData.getGithubLogin()
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
                        sessionData.setGithubId(null);
                        sessionData.setGithubAuthToken(null);
                        sessionData.setGithubLogin(null);
                        sessionData.setGithubState(null);
                        _this.sessionManager.updateSession(session, function(throwable, session) {
                            flow.complete(throwable);
                        });
                    } else {
                        flow.complete();
                    }

                }),
                $task(function(flow){
                    var action = _this.actionManager.generateAction({
                        actionData: {},
                        actionType: "Signup",
                        actionVersion: "0.0.1",
                        occurredAt: new Date(Date.now()),
                        userId: user.getId()
                    });
                    _this.actionManager.createAction(action, function(throwable, returnedAction){
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

        /**
         * @param {RequestContext} requestContext
         * @param {string} userId
         * @param {{
         *      firstName: string,
         *      lastName: string
         * }} updateObject
         * @param {function(Throwable, User=)} callback
         */
        updateUser: function(requestContext, userId, updateObject, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            /** @type {User} */
            var user                = null;

            $series([
                $task(function(flow) {
                    _this.dbRetrieveUser(userId, function(throwable, returnedUser){
                        if (!throwable) {
                            if (returnedUser) {
                                if (returnedUser.getId() === currentUser.getId()) {
                                    user = returnedUser;
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("UnauthorizedAccess", {}, "CurrentUser can only update their own user"));
                                }
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find User with the id '" + userId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    if (Obj.hasProperty(updateObject, "firstName")) {
                        user.setFirstName(updateObject.firstName);
                    }
                    if (Obj.hasProperty(updateObject, "lastName")) {
                        user.setLastName(updateObject.lastName);
                    }
                    flow.complete();
                }),
                $task(function(flow) {
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

        /**
         * @param {RequestContext} requestContext
         * @param {string} userId
         * @param {{
         *      confirmPassword: string,
         *      password: string,
         *      oldPassword: string
         * }} updateObject
         * @param {function(Throwable, User=)} callback
         */
        updateUserPassword:function(requestContext, userId, updateObject, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            /** @type {User} */
            var user                = null;

            $series([
                $task(function(flow) {
                    if (!Obj.hasProperty(updateObject, "password")) {
                        flow.complete(new Exception("BadRequest", {}, "password required on updateObject"));
                    } else if (!Obj.hasProperty(updateObject, "confirmPassword")) {
                        flow.complete(new Exception("BadRequest", {}, "confirmPassword required on updateObject"));
                    } else if (!Obj.hasProperty(updateObject, "oldPassword")) {
                        flow.complete(new Exception("BadRequest", {}, "oldPassword required on updateObject"));
                    } else if (updateObject.password !== updateObject.confirmPassword) {
                        flow.complete(new Exception("PasswordMismatch", {}, "Password and confirmPassword must match"));
                    } else if (!PasswordUtil.isValid(updateObject.password)) {
                        flow.complete(new Exception("InvalidPassword", {}, "Invalid password"));
                    } else {
                        flow.complete();
                    }
                }),
                $task(function(flow) {
                    _this.dbRetrieveUser(userId, function(throwable, returnedUser){
                        if (!throwable) {
                            if (returnedUser) {
                                if (returnedUser.getId() === currentUser.getId()) {
                                    user = returnedUser;
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("UnauthorizedAccess", {}, "CurrentUser can only update their own user"));
                                }
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find User with the id '" + userId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.verifyPasswordMatch(updateObject.oldPassword, user, function(throwable, result) {
                        if (!throwable) {
                            if (!result) {
                                flow.complete(new Exception("InvalidPassword", {}, "Could not update user's password because old password could not be verified"));
                            } else {
                                flow.complete();
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.generatePasswordHash(updateObject.password, function(throwable, passwordHash) {
                        if (!throwable) {
                            user.setPasswordHash(passwordHash);
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
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
         * @param {string} password
         * @param {function(Throwable, string=)} callback
         */
        generatePasswordHash: function(password, callback) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    callback(new Bug("bcrypt error", {}, "An error occurred in bcrypt", [err]));
                } else {
                    bcrypt.hash(password, salt, function(err, passwordHash) {
                        if (!err) {
                            callback(null, passwordHash);
                        } else {
                            callback(new Bug("bcrypt error", {}, "An error occurred in bcrypt", [err]))
                        }
                    });
                }
            });
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

        /**
         * @param {string} password
         * @param {User} user
         * @param {function(Throwable, boolean=)} callback
         */
        verifyPasswordMatch: function(password, user, callback) {
            var _this           = this;
            var result          = false;
            $task(function(flow) {
                if (!password) {
                    flow.complete(new Exception("InvalidPassword", {}, "No password was given"));
                } else if (!user.getPasswordHash()) {
                    flow.complete(new Bug("PasswordHashNotFound", {}, "User did not have a password hash"));
                } else {
                    bcrypt.compare(password, user.getPasswordHash(), function(error, returnedResult) {
                        if (!error) {
                            result = returnedResult;
                            flow.complete();
                        } else {
                            flow.complete(new Exception("BcryptError", {}, "Error occurred in bcrypt", [error]));
                        }
                    });
                }
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, result);
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
         * @param {function(Throwable, User=)} callback
         */
        dbRetrieveUser: function(userId, callback) {
            this.userManager.retrieveUser(userId, callback);
        },

        /**
         * @private
         * @param {Array.<string>} userIds
         * @param {function(Throwable, User=)} callback
         */
        dbRetrieveUsers: function(userIds, callback) {
            this.userManager.retrieveUsers(userIds, callback);
        },

        /**
         * @private
         * @param {string} userEmail
         * @param {function(Throwable, User=)} callback
         */
        dbRetrieveUserByEmail: function(userEmail, callback) {
            this.userManager.retrieveUserByEmail(userEmail, callback);
        },

        /**
         * @private
         * @param {string} userId
         * @param {function(Throwable, User=)} callback
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

    bugmeta.tag(UserService).with(
        module("userService")
            .args([
                arg().ref("logger"),
                arg().ref("sessionManager"),
                arg().ref("userManager"),
                arg().ref("sessionService"),
                arg().ref("airbugClientRequestPublisher"),
                arg().ref("githubManager"),
                arg().ref("userPusher"),
                arg().ref("betaKeyService"),
                arg().ref("actionManager"),
                arg().ref("airbugServerConfig")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserService', UserService);
});
