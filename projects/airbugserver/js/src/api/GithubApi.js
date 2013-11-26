//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubApi')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('Url')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();
var Github                      = require("github");
var https                       = require('https');


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

    _constructor: function(http, github) {
        this.http = http;
        this.github = github;
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} code
     * @param {function(Throwable, String)=} callback
     */
    getAuthToken: function(code, callback) {

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
            "&client_id=" + encodeURIComponent() +
            "&client_secret" + encodeURIComponent();


        var options = {
            hostname: 'github.com',
            port: 443,
            path: path,
            method: 'POST',
            headers: {}
        };

        var result = "";
        var statusCode = undefined;
        var resultHeaders = undefined;

        var req = https.request(options, function(res) {
            statusCode = res.statusCode;
            resultHeaders = res.headers;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                result += chunk;
                //console.log('BODY: ' + chunk);
            });
        });

        req.on('error', function(error) {
            console.log('problem with request: ' + e.message);
        });

        req.on('close'), function() {
            var authObject = jQuery.parseJSON(result);
            callback(undefined, authObject);
        }
        req.end();
    },

    /**
     * @param authToken
     * @param {function(Throwable, Object)} callback
     */
    retrieveGithubUser: function(authToken, callback) {
        var github = new Github({
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
                var githubUser = jQuery.parseJSON(res);
                callback(undefined, githubUser);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubApi', GithubApi);
