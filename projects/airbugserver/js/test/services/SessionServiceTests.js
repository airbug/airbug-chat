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

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionService')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Session                 = bugpack.require('airbugserver.Session');
    var SessionService          = bugpack.require('airbugserver.SessionService');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
    var BugYarn                 = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var bugyarn                 = BugYarn.context();
    var test                    = TestAnnotation.test;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestSessionService", function(yarn) {
        yarn.spin([
            "setupTestSessionServiceConfig",
            "setupTestCookieParser",
            "setupTestCookieSigner",
            "setupTestSessionManager",
            "setupTestMarshaller"
        ]);
        yarn.wind({
            sessionService: new SessionService(this.sessionServiceConfig, this.cookieParser, this.cookieSigner, this.sessionManager, this.marshaller)
        });
    });


    //-------------------------------------------------------------------------------
    // Test Setup Methods
    //-------------------------------------------------------------------------------

    var setupSessionService = function(setupObject) {
        setupObject.testSessionKey          = "testSessionKey";
        setupObject.testCookie              = "testCookie";
        setupObject.testCookieString        = "testCookieString";
        setupObject.testCookieObject        = {};
        setupObject.testCookieObject[setupObject.testSessionKey] = setupObject.testCookie;
        setupObject.testUnsignedCookie = "testUnsignedCookie";
        setupObject.dummyConfig = {
            getSessionKey: function() {
                return setupObject.testSessionKey;
            }
        };
        setupObject.dummyCookieParser = {
            parse: function(cookieString) {
                return setupObject.testCookieObject;
            }
        };
        setupObject.dummyCookieSigner = {
            unsign: function(cookie) {
                return setupObject.testUnsignedCookie;
            }
        };
        setupObject.testSessionService = new SessionService(setupObject.dummyConfig, setupObject.dummyCookieParser, setupObject.dummyCookieSigner, {}, {});
        setupObject.testHandShakeData = {
            headers: {
                cookie: setupObject.testCookieString
            }
        };
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var sessionServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestSessionServiceConfig",
                "setupTestCookieParser",
                "setupTestCookieSigner",
                "setupTestSessionManager",
                "setupTestMarshaller"
            ]);
            this.testSessionService    = new SessionService(this.sessionServiceConfig, this.cookieParser, this.cookieSigner, this.sessionManager, this.marshaller);
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testSessionService, SessionService),
                "Assert instance of SessionService");
            test.assertEqual(this.testSessionService.getConfig(), this.sessionServiceConfig,
                "Assert .config was set correctly");
            test.assertEqual(this.testSessionService.getCookieParser(), this.cookieParser,
                "Assert .cookieParser was set correctly");
            test.assertEqual(this.testSessionService.getCookieSigner(), this.cookieSigner,
                "Assert .cookieSigner was set correctly");
            test.assertEqual(this.testSessionService.getSessionManager(), this.sessionManager,
                "Assert .sessionManager was set correctly");
            test.assertEqual(this.testSessionService.getMarshaller(), this.marshaller,
                "Assert .marshaller was set correctly");
        }
    };

    var sessionServiceShakeItTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            setupSessionService(this);
            test.completeSetup();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.testSessionService.shakeIt(this.testHandShakeData, function(throwable, result) {
                test.assertEqual(result, true,
                    "Assert that returned result was true");
                test.assertEqual(_this.testHandShakeData.sessionId, _this.testUnsignedCookie,
                    "Assert that the sessionId was set to the unsigned cookie");
                test.completeTest();
            });
        }
    };

    var sessionServiceShakeItNoCookieTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestSessionService"
            ]);
            this.testHandShakeData = {
                headers: {
                    cookie: "undefined-session=%7B%22sessionUuid%22%3A%22a22546df-dc6b-2c14-35a8-e71a03fb3032%22%7D; splitbug-test-user=%7B%22userUuid%22%3A%22a9c374de-0529-1ae7-b537-e397b99ba520%22%7D; splitbug-test-session=%7B%22sessionUuid%22%3A%22c7a71caf-a526-b740-d1a0-2ee2a06973db%22%2C%22testGroup%22%3A%22control%22%2C%22testName%22%3A%22alternate-tag-line%22%2C%22userUuid%22%3A%22a9c374de-0529-1ae7-b537-e397b99ba520%22%7D"
                }
            };
            test.completeSetup();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.sessionService.shakeIt(this.testHandShakeData, function(throwable, result) {
                test.assertEqual(result, false,
                    "Assert shake result was false");
                test.assertTrue(Class.doesExtend(throwable, Exception),
                    "Assert an Exception was thrown");
                if (throwable) {
                    test.assertEqual(throwable.getType(), "NoCookie",
                        "Assert throwable type is NoCookie");
                }
                test.completeTest();
            });
        }
    };

    var sessionServiceShakeItWithCookieTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestSessionService"
            ]);
            this.testHandShakeData = {
                headers: {
                    cookie: "undefined-session=%7B%22sessionUuid%22%3A%22a22546df-dc6b-2c14-35a8-e71a03fb3032%22%7D; splitbug-test-user=%7B%22userUuid%22%3A%22a9c374de-0529-1ae7-b537-e397b99ba520%22%7D; splitbug-test-session=%7B%22sessionUuid%22%3A%22c7a71caf-a526-b740-d1a0-2ee2a06973db%22%2C%22testGroup%22%3A%22control%22%2C%22testName%22%3A%22alternate-tag-line%22%2C%22userUuid%22%3A%22a9c374de-0529-1ae7-b537-e397b99ba520%22%7D; airbug.sid=s%3A915655a9-8a1f-b080-42ba-e7b41ba7a0d0.2COUgeQgMn2bwvX%2BueTHCpyzKZw2t3lImjoAm%2FWt8ec"
                }
            };
            test.completeSetup();
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.sessionService.shakeIt(this.testHandShakeData, function(throwable, result) {
                if (!throwable) {
                    test.assertEqual(result, true,
                        "Assert that returned result was true");
                    var expectedCookie = {
                        'undefined-session': '{"sessionUuid":"a22546df-dc6b-2c14-35a8-e71a03fb3032"}',
                        'splitbug-test-user': '{"userUuid":"a9c374de-0529-1ae7-b537-e397b99ba520"}',
                        'splitbug-test-session': '{"sessionUuid":"c7a71caf-a526-b740-d1a0-2ee2a06973db","testGroup":"control","testName":"alternate-tag-line","userUuid":"a9c374de-0529-1ae7-b537-e397b99ba520"}',
                        'airbug.sid': 's:915655a9-8a1f-b080-42ba-e7b41ba7a0d0.2COUgeQgMn2bwvX+ueTHCpyzKZw2t3lImjoAm/Wt8ec'
                    };
                    test.assertEqual(JSON.stringify(_this.testHandShakeData.cookie), JSON.stringify(expectedCookie),
                        "Assert cookie is expected value");
                    test.assertEqual(_this.testHandShakeData.sessionId, "915655a9-8a1f-b080-42ba-e7b41ba7a0d0",
                        "Assert that the sessionId was correctly unsigned");
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
                test.completeTest();
            });
        }
    };

    var sessionServiceBuildRequestContextTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestSessionService"
            ]);
            this.dummyRequest       = {
                sessionId: null
            };
            this.testRequestContext = yarn.weave("testRequestContext", [this.dummyRequest]);
            this.marshRegistry.processModule();
            this.schemaManager.processModule();
            this.mongoDataStore.processModule();
            $task(function(flow) {
                _this.sessionManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            this.sessionService.buildRequestContext(this.testRequestContext, function(throwable) {
                if (!throwable) {
                    var session = _this.testRequestContext.get("session");
                    test.assertTrue(Class.doesExtend(session, Session),
                        "Assert session is an instance of Session");
                    test.assertTrue(!!session.getId(),
                        "Assert session.id is set");
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    var sessionServiceLoadSessionBySidExistingNotExpiredSessionTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestSessionService"
            ]);
            this.marshRegistry.processModule();
            this.schemaManager.processModule();
            this.mongoDataStore.processModule();
            $series([
                $task(function(flow) {
                    _this.sessionManager.initializeModule(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.testSession = yarn.weave("testSession", [{
                        cookie: {
                            expires: new Date(Date.now() + 1000)
                        }
                    }]);
                    _this.sessionManager.createSession(_this.testSession, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var originalSession = this.testSession.clone(true);
            this.sessionService.loadSessionBySid(this.testSession.getSid(), function(throwable, session) {
                if (!throwable) {
                    test.assertTrue(session.getExpires() > originalSession.getExpires(),
                        "Assert that Session.expires has been reset");
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(sessionServiceInstantiationTest).with(
        test().name("SessionService - instantiation test")
    );
    bugmeta.annotate(sessionServiceShakeItTest).with(
        test().name("SessionService #shakeIt Test")
    );
    bugmeta.annotate(sessionServiceShakeItWithCookieTest).with(
        test().name("SessionService - #shakeIt with cookie Test")
    );
    bugmeta.annotate(sessionServiceShakeItNoCookieTest).with(
        test().name("SessionService - #shakeIt no cookie Test")
    );
    bugmeta.annotate(sessionServiceBuildRequestContextTest).with(
        test().name("SessionService - #buildRequestContext Test")
    );
    bugmeta.annotate(sessionServiceLoadSessionBySidExistingNotExpiredSessionTest).with(
        test().name("SessionService - #loadSessionBySid existing not expired session Test")
    );
});
