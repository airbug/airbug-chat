//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.HomePageController')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')
//@Require('airbugserver.Controller')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
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
    var Controller          = bugpack.require('airbugserver.Controller');
    var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
    var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgAnnotation.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleAnnotation.module;


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
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {AirbugClientConfig} airbugClientConfig
         */
        _constructor: function(controllerManager, expressApp, airbugClientConfig) {

            this._super(controllerManager, expressApp);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugClientConfig}
             */
            this.airbugClientConfig     = airbugClientConfig;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this = this;
            this.getExpressApp().get('/app', function(request, response) {
                var requestContext          = request.requestContext;
                var session                 = requestContext.get("session");
                var configObject            = _this.airbugClientConfig.toObject();
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

            this.getExpressApp().get('/client_api', function(request, response) {
                var requestContext          = request.requestContext;
                var session                 = requestContext.get("session");
                var configObject            = _this.airbugClientConfig.toObject();
                configObject.github.state   = session.getData().githubState;
                configObject.github.emails  = session.getData().githubEmails;
                response.render('client_api', {
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

    bugmeta.annotate(HomePageController).with(
        module("homePageController")
            .args([
                arg().ref("controllerManager"),
                arg().ref("expressApp"),
                arg().ref("airbugClientConfig")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.HomePageController', HomePageController);
});
