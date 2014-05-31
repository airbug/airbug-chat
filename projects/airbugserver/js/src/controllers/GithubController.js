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

//@Export('airbugserver.GithubController')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbug.GithubDefines')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerAnnotation')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


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
    var GithubDefines           = bugpack.require('airbug.GithubDefines');
    var EntityController        = bugpack.require('airbugserver.EntityController');
    var ControllerAnnotation    = bugpack.require('bugcontroller.ControllerAnnotation');
    var BugFlow                 = bugpack.require('bugflow.BugFlow');
    var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgAnnotation.arg;
    var bugmeta                 = BugMeta.context();
    var controller              = ControllerAnnotation.controller;
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var GithubController = Class.extend(EntityController, {

        _name: "airbugserver.GithubController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        _constructor: function(controllerManager, expressApp, bugCallRouter, githubService) {

            this._super(controllerManager, expressApp);


            //-------------------------------------------------------------------------------
            // Private Properties
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
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
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

            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(GithubController).with(
        controller("githubController")
            .args([
                arg().ref("controllerManager"),
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("githubService")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.GithubController', GithubController);
});
