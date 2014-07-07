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

//@Export('airbugserver.HomePageController')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')
//@Require('bugcontroller.Controller')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var StringUtil          = bugpack.require('StringUtil');
    var Controller          = bugpack.require('bugcontroller.Controller');
    var ArgTag       = bugpack.require('bugioc.ArgTag');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Controller}
     */
    var HomePageController = Class.extend(Controller, {

        _name: "airbugserver.HomePageController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {AirbugStaticConfig} airbugStaticConfig
         */
        _constructor: function(expressApp, airbugStaticConfig) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig     = airbugStaticConfig;

            /**
             * @private
             * @type {ExpressApp}
             */
            this.expressApp             = expressApp;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this = this;
            this.expressApp.get('/app', function(request, response) {
                var requestContext          = request.requestContext;
                var session                 = requestContext.get("session");
                var configObject            = _this.airbugStaticConfig.toObject();
                configObject.github.state   = session.getData().githubState;
                configObject.github.emails  = session.getData().githubEmails;
                response.render('home', {
                    locals: {
                        config: StringUtil.escapeString(JSON.stringify(configObject)),
                        debug: configObject.debug,
                        js: configObject.js,
                        staticUrl: configObject.staticUrl
                    }
                }, function(error, html)  {
                    if (error) {
                        console.error(error);
                        response.send(500, "an error occurred");
                    } else {
                        console.log('html:' + html);
                        response.send(html);
                    }
                });
            });

            this.expressApp.get('/plugin', function(request, response) {
                var requestContext          = request.requestContext;
                var session                 = requestContext.get("session");
                var configObject            = _this.airbugStaticConfig.toObject();
                configObject.github.state   = session.getData().githubState;
                configObject.github.emails  = session.getData().githubEmails;
                response.render('plugin', {
                    locals: {
                        config: StringUtil.escapeString(JSON.stringify(configObject)),
                        debug: configObject.debug,
                        js: configObject.js,
                        staticUrl: configObject.staticUrl
                    }
                }, function(error, html)  {
                    if (error) {
                        console.error(error);
                        response.send(500, "an error occurred");
                    } else {
                        console.log('html:' + html);
                        response.send(html);
                    }
                });
            });

            callback();
        }
    });

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(HomePageController).with(
        module("homePageController")
            .args([
                arg().ref("expressApp"),
                arg().ref("airbugStaticConfig")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.HomePageController', HomePageController);
});
