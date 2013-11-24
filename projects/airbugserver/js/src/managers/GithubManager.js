//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();
var GitHubApi                   = require("github");
var https                       = require('https');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var BugFlow                     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var GithubManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} code
     * @param {function(Throwable, String)=} callback
     */
    getAuthToken: function(code, callback) {
        // TODO - DKK - wire up client id
        // TODO - DKK - wire up client_secret
        var params = {
            'client_id': '',
            'client_secret': '',
            'code': 'cc31f9ba8e97a3497e0f'
        };

        var headers = {
            'Content-Type': 'application/json',
            'Host': 'github.com',
            'Accept': 'application/json'
        };

        // TODO - DKK - build path. It should look like:
        //   /login/oauth/access_token?code={code}&client_id={client_id}&client_secret={client_secret}
        //path = buildPath();

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
        var github = new GitHubApi({
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(GithubManager).with(
    entityManager("githubManager")
        .ofType("GitHubApi")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubManager', GithubManager);
