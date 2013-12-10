//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GithubController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbug.GithubDefines')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Obj                 = bugpack.require('Obj');
var GithubDefines       = bugpack.require('airbug.GithubDefines');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var GithubController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, githubService) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter          = bugCallRouter;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp             = expressApp;

        /**
         * @private
         * @type {GithubService}
         */
        this.githubService          = githubService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this           = this;
        var expressApp      = this.expressApp;
        var githubService   = this.githubService;

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------
        expressApp.get(GithubDefines.RedirectUris.CALLBACK, function(request, response) {
            var error = request.query.error;

            // If a user clicks on "deny this request"
            if (error === "access_denied") {
                _this.sendRedirectResponse(response, "/app");
            }
        });

        expressApp.get(GithubDefines.RedirectUris.LOGIN, function(request, response) {
            var requestContext      = request.requestContext;
            var session             = requestContext.get("session");
            var emails              = session.getData().githubEmails;
            var currentUser         = requestContext.get("currentUser");
            var query               = request.query;
            githubService.loginUserWithGithub(requestContext, query.code, query.state, query.error, function(throwable) {
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else if (emails && currentUser.isAnonymous()) {
                    _this.sendRedirectResponse(response, "/app#githubLogin");
                } else {
                    _this.sendRedirectResponse(response, "/app");
                }
            });
        });


        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        this.bugCallRouter.addAll({

            //NOTE BRN: This is where api calls for accessing github data will go
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     * @param {Response} response
     */
    processAjaxThrowable: function(throwable, response) {

        //TEST
        console.log("Error occurred during request");
        console.log(throwable);
        console.log(throwable.stack);

        if (Class.doesExtend(throwable, Exception)) {
            if (throwable.getType() === "NotFound") {
                this.sendAjaxNotFoundResponse(response);
            } else {
                this.sendAjaxErrorResponse(throwable, response);
                console.error(throwable);
            }
        } else {
            this.sendAjaxErrorResponse(throwable, response);
        }
    },

    /**
     * @private
     * @param {Error} error
     * @param {Response} response
     */
    sendAjaxErrorResponse: function(error, response) {
        response.status(500);
        response.json({error: error.toString()});
    },

    /**
     * @private
     * @param {Response} response
     */
    sendAjaxNotFoundResponse: function(response) {
        response.status(404);
        response.json({exception: new Exception("NotFound")});
    },

    /**
     * @private
     * @param {Response} response
     */
    sendAjaxSuccessResponse: function(response) {
        response.json({success: true});
    },

    /**
     * @private
     * @param {Response} response
     * @param {string} url
     */
    sendRedirectResponse: function(response, url) {
        response.redirect(url);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GithubController', GithubController);
