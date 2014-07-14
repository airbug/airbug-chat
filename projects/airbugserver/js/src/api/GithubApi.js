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

//@Export('airbugserver.GithubApi')
//@Autowired

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('Url')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flows       = bugpack.require('Flows');
    var Obj         = bugpack.require('Obj');
    var Set         = bugpack.require('Set');
    var Url         = bugpack.require('Url');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series     = Flows.$series;
    var $task       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var GithubApi = Class.extend(Obj, {

        _name: "airbugserver.GithubApi",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} https
         * @param {*} github
         * @param {AirbugServerConfig} airbugServerConfig
         */
        _constructor: function(https, github, airbugServerConfig) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugServerConfig}
             */
            this.airbugServerConfig = airbugServerConfig;

            /**
             * @private
             * @type {*}
             */
            this.github             = github;

            /**
             * @private
             * @type {*}
             */
            this.https              = https;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugServerConfig}
         */
        getAirbugServerConfig: function() {
            return this.airbugServerConfig;
        },

        /**
         * @return {*}
         */
        getGithub: function() {
            return this.github;
        },

        /**
         * @return {*}
         */
        getHttps: function() {
            return this.https;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} code
         * @param {function(Throwable, String)=} callback
         */
        getAuthToken: function(code, callback) {
            var _this = this;

            var path = "/login/oauth/access_token?" +
                "code=" + encodeURIComponent(code) +
                "&client_id=" + encodeURIComponent(this.airbugServerConfig.getGithubClientId()) +
                "&client_secret=" + encodeURIComponent(this.airbugServerConfig.getGithubClientSecret());

            var options = {
                hostname: 'github.com',
                port: 443,
                path: path,
                method: 'POST',
                headers: {'Accept': 'application/json'}
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
            var responseObject = "";
            var error = undefined;
            var authToken = undefined;
            try {
                responseObject = JSON.parse(responseData);
                authToken = responseObject.access_token;
            } catch (e) {
                error = e;
            }
            callback(error, authToken);
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
});
