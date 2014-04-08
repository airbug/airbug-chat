//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.GithubApi')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var GithubApi               = bugpack.require('airbugserver.GithubApi');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestGithubApi", function(yarn) {
    yarn.spin([
        "setupTestAirbugServerConfig"
    ]);
    var dummyHttps = {};
    var dummyGithub = {};
    yarn.wind({
        githubApi: new GithubApi(dummyHttps, dummyGithub, this.airbugServerConfig)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubApiInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestAirbugServerConfig"
        ]);
        this.dummyHttps         = {};
        this.dummyGithub        = {};
        this.testGithubApi      = new GithubApi(this.dummyHttps, this.dummyGithub, this.airbugServerConfig);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testGithubApi, GithubApi),
            "Assert instance of GithubApi");
        test.assertEqual(this.testGithubApi.getGithub(), this.dummyGithub,
            "Assert .github was set correctly");
        test.assertEqual(this.testGithubApi.getHttps(), this.dummyHttps,
            "Assert .https was set correctly");
        test.assertEqual(this.testGithubApi.getAirbugServerConfig(), this.airbugServerConfig,
            "Assert .airbugServerConfig was set correctly");
    }
};
bugmeta.annotate(githubApiInstantiationTest).with(
    test().name("GithubApi - instantiation test")
);


var githubApiGetAuthTokenTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testAuthToken = 'cfb73f18e5fa8790fded4f073a1f640eeee7e351';
        this.responseEventHandlers = {};
        this.requestEventHandlers = {};
        this.requestCallback = undefined;
        this.responseData = '{"access_token":"' + this.testAuthToken + '","token_type":"bearer",' +
            '"scope":"gist,notifications,repo,user,user:email"}';
        this.testResponse = {
            on: function(event, callback) {
                _this.responseEventHandlers[event] = callback;
            },
            setEncoding: function() {},
            statusCode: 200,
            resultHeaders: ""
        };
        this.testHttps = {
            request: function(options, callback) {
                _this.requestCallback = callback;
                return {
                    end: function() {
                        _this.requestCallback(_this.testResponse);
                        _this.responseEventHandlers['data'](_this.responseData);
                        _this.responseEventHandlers['close']();
                    },
                    on: function(event, callback) {
                        _this.requestEventHandlers[event] = callback;
                    }
                };
            }
        };
        this.testAirbugServerConfig = {
            getGithubClientId: function() {
                return 'testClientId';
            },
            getGithubClientSecret: function() {
                return 'testClientSecret';
            }
        };
        this.githubApi = new GithubApi(this.testHttps, {}, this.testAirbugServerConfig);
        test.completeSetup();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.githubApi.getAuthToken("testCode", function(throwable, authToken) {
            test.assertTrue(TypeUtil.isString(authToken),
                "authToken must be a string");
            test.assertTrue(authToken.length > 0,
                "authToken must have a length greater than 0");
            console.log("authToken =", authToken, 'this.testAuthToken = ', _this.testAuthToken);
            test.assertEqual(_this.testAuthToken, authToken,
                "authToken must be the value we parsed from the github response");
            if (throwable) {
                test.error();
            } else {
                test.completeTest();
            }
        });
    }
};

bugmeta.annotate(githubApiGetAuthTokenTest).with(
    test().name("GitHubApi - getAuthToken tests")
);

var githubApiRetrieveGithubUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testGithubUser = {
            login: 'dicegame',
            id: 1810478
        };
        this.testAuthToken = "cfb73f18e5fa8790fded4f073a1f640eeee7e351";
        this.testGithub = function() {
            return {
                authenticate: function(credientialsObject) {

                },
                user: {
                    get: function(props, callback) {
                        var err = undefined;
                        callback(err, _this.testGithubUser);
                    }
                }
            };
        };
        this.testAirbugServerConfig = {
            getGithubClientId: function() {
                return 'testClientId';
            },
            getGithubClientSecret: function() {
                return 'testClientSecret';
            }
        };
        this.githubApi = new GithubApi({}, this.testGithub, this.testAirbugServerConfig);
        test.completeSetup();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.githubApi.retrieveGithubUser(this.testAuthToken, function(throwable, githubUser) {
            test.assertTrue(TypeUtil.isObject(githubUser),
                'Ensure returned githubUser is an object');
            test.assertEqual('dicegame', githubUser.login,
                'Ensure login property is what we expect');
            test.assertEqual(1810478, githubUser.id,
                'Ensure id property is what we expect');
            if (throwable) {
                test.error();
            } else {
                test.completeTest();
            }
        });
    }
};

bugmeta.annotate(githubApiRetrieveGithubUserTest).with(
    test().name("GitHubApi - retrieveGithubUser tests")
);
