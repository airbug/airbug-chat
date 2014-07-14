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

//@Export('airbugserver.GithubService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('UuidGenerator')
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
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Obj                     = bugpack.require('Obj');
    var TypeUtil                = bugpack.require('TypeUtil');
    var UuidGenerator           = bugpack.require('UuidGenerator');
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
    var GithubService = Class.extend(Obj, {

        _name: "airbugserver.GithubService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SessionManager} sessionManager
         * @param {GithubManager} githubManager
         * @param {GithubApi} githubApi
         * @param {UserService} userService
         * @param {UserManager} userManager
         */
        _constructor: function(sessionManager, githubManager, githubApi, userService, userManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

            /**
             * @private
             * @type {UserManager}
             */
            this.userManager            = userManager;
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
            var _this           = this;
            var session         = requestContext.get("session");
            var currentUser     = requestContext.get("currentUser");
            var authToken       = undefined;
            var githubUser      = undefined;
            var emails          = undefined;
            var githubEntity    = undefined;

            if (error) {
                // bad_verification_code - user has
                // incorrect_client_credentials - client_id or client_secret is not set properly.
                callback(new Exception("GithubError", {}, "Error occurred on Github"));
            } else if (state !== session.getData().getGithubState()) {
                callback(new Exception("badState", {}, "States do not match"));
            } else {
                $series([
                    $task(function(flow) {
                        try {
                            _this.githubApi.getAuthToken(code, function(throwable, token) {
                                authToken = token;
                                flow.complete(throwable);
                            });
                        } catch (e) {
                            console.log('GithubService #loginUserWithGithub ERROR calling getAuthToken', e, " trace ", e.trace);
                            flow.error(e);
                        }
                    }),
                    $task(function(flow) {
                        _this.githubApi.retrieveGithubUser(authToken, function(throwable, githubUserObject) {
                            if (!throwable) {
                                githubUser = githubUserObject;
                            }
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        var githubId = githubUser.id;
                        if (!TypeUtil.isNumber(githubId)) {
                            flow.complete(new Error("NotFound"));
                        } else {
                            _this.githubManager.retrieveGithubByGithubId(githubId, function(throwable, github) {
                                if (!throwable) {
                                    if (github) {
                                        githubEntity = github;
                                        _this.githubManager.populateGithub(github, ["user"], function(throwable) {
                                            _this.userService.loginUser(requestContext, github.getUser(), function(throwable, user) {
                                                flow.complete(throwable);
                                            });
                                        });
                                    } else {
                                        flow.complete();
                                    }
                                } else {
                                    flow.error(throwable);
                                }
                            });
                        }
                    }),
                    $task(function(flow) {
                        var githubEmail = githubUser.email;
                        if (githubEmail) {
                            _this.userManager.retrieveUserByEmail(githubEmail, function(throwable, user) {
                                if (user) {
                                    if (emails === undefined) {
                                        emails = [];
                                    }
                                    emails.push(githubEmail);
                                }
                                flow.complete();
                            })
                        } else {
                            flow.complete();
                        }
                    }),
                    $task(function(flow) {
                        // Link to current user if they are logged in and there isn't an existing github entity
                        if (currentUser.isNotAnonymous() && !githubEntity) {
                            var github = new Github({
                                userId: currentUser.id,
                                githubAuthToken: authToken,
                                githubId: githubUser.id,
                                githubLogin: githubUser.login
                            });
                            _this.githubManager.createGithub(github, function(throwable, github) {
                                flow.complete(throwable);
                            });
                        } else {
                            flow.complete();
                        }
                    }),
                    $task(function(flow) {
                        // No github record found. Add data to session so that we can use it when the user logs in or registers
                        if (!githubEntity) {
                            _this.addGithubDataToSession(session, githubUser.id, authToken, githubUser.login, emails, function() {
                                flow.complete();
                            });
                        } else {
                            flow.complete();
                        }
                    })
                ]).execute(function(throwable) {
                    if (throwable) {
                        callback(throwable);
                    } else {
                        callback();
                    }
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Session} session
         * @param {function(Throwable=)} callback
         */
        ensureGithubStateOnSession: function(session, callback) {
            var sessionData = session.getData();
            if (!sessionData.getGithubState()) {
                sessionData.setGithubState(this.generateGithubState());
            }
            this.sessionManager.updateSession(session, function(throwable, session) {
                callback(throwable);
            });
        },

        /**
         * @private
         * @param {Session} session
         * @param {function(Throwable=)} callback
         */
        addGithubDataToSession: function(session, githubId, authToken, githubLogin, emails, callback) {
            var sessionData = session.getData();
            sessionData.setGithubId(githubId);
            sessionData.setGithubAuthToken(authToken);
            sessionData.setGithubLogin(githubLogin);
            sessionData.setGithubEmails(emails);
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
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(GithubService).with(
        module("githubService")
            .args([
                arg().ref("sessionManager"),
                arg().ref("githubManager"),
                arg().ref("githubApi"),
                arg().ref("userService"),
                arg().ref("userManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.GithubService', GithubService);
});
