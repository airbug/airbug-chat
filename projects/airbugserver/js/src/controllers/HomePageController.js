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
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


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
 * @constructor
 * @extends {Controller}
 */
var HomePageController = Class.extend(Controller, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
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
    // Class Methods
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
