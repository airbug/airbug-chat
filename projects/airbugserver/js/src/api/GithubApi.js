//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubApi')
//@Autowired

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('Url')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var Url                         = bugpack.require('Url');
var BugFlow                     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var GithubApi = Class.extend(Obj, {

    _constructor: function(https, github, airbugServerConfig) {
        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.https = https;
        this.github = github;

        /**
         * @private
         * @type {AirbugServerConfig}
         */
        this.airbugServerConfig = airbugServerConfig;

        if (! airbugServerConfig) {
            console.log("ERROR: GithubApi#constructor airbugServerConfig was not defined! ",
                airbugServerConfig, " https ", https, " github ", github);
        }
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} code
     * @param {function(Throwable, String)=} callback
     */
    getAuthToken: function(code, callback) {
        var _this = this;
        var headers = {
            'Content-Type': 'application/json',
            'Host': 'github.com',
            'Accept': 'application/json'
        };

        // TODO - DKK - wire up client id
        // TODO - DKK - wire up client_secret
        // TODO - DKK - build path. It should look like:
        //   /login/oauth/access_token?code={code}&client_id={client_id}&client_secret={client_secret}
        //path = buildPath();
        var path = "/login/oauth/access_token?" +
            "code=" + encodeURIComponent(code) +
            "&client_id=" + encodeURIComponent(this.airbugServerConfig.getGithubClientId()) +
            "&client_secret=" + encodeURIComponent(this.airbugServerConfig.getGithubClientSecret());

        var options = {
            hostname: 'github.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {'Accept': 'application/json'} // 'Accept': 'application/json'
        };

        var responseData = "";
        var statusCode = undefined;
        var resultHeaders = undefined;

        var req = this.https.request(options, function(res) {
            statusCode = res.statusCode;
            resultHeaders = res.headers;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                responseData += chunk;
                console.log('BODY: ' + chunk);
            });
            res.on('close', function() {
                _this.handleRequestEnd(responseData, callback);
            });
            res.on('end', function() {
                _this.handleRequestEnd(responseData, callback);
            });
        });

        req.end();

        req.on('error', function(error) {
            console.log('problem with request: ' + error.message);
            callback(error);
        });
    },

    handleRequestEnd: function(responseData, callback) {
        console.log("getAuthToken - in end handler");
        var responseObject = JSON.parse(responseData);
        var authToken = responseObject.access_token;
        callback(undefined, authToken);
    },

    /**
     * @param authToken
     * @param {function(Throwable, Object)} callback
     */
    retrieveGithubUser: function(authToken, callback) {
        var github = new this.github({
            version: "3.0.0", // required
            timeout: 5000 // optional
        });
        github.authenticate({
            type: "oauth",
            token: authToken
        });
        github.user.get({}, function(err, res) {
                // console.log("GOT ERR?", err);
                // console.log("GOT RES?", res);
                if (err) {
                    callback(err, undefined);
                } else {
                    var githubUser = res;
                    callback(undefined, githubUser);
                }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubApi', GithubApi);
