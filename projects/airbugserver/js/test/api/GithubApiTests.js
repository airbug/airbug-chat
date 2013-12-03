//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('airbugserver.GithubApi')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var GithubApi               = bugpack.require('airbugserver.GithubApi');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubApiGetAuthTokenTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
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
                }
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
                test.complete();
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

    setup: function() {
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
                test.complete();
            }
        });
    }
};

bugmeta.annotate(githubApiRetrieveGithubUserTest).with(
    test().name("GitHubApi - retrieveGithubUser tests")
);
