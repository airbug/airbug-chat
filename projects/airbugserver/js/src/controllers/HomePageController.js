//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('HomePageController')

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var StringUtil      = bugpack.require('StringUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var HomePageController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {AirbugClientConfig} airbugClientConfig
     * @param {ExpressApp} expressApp
     */
    _constructor: function(airbugClientConfig, expressApp) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig     = airbugClientConfig;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp             = expressApp;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this = this;
        this.expressApp.get('/app', function(request, response) {
            var requestContext          = request.requestContext;
            var session                 = requestContext.get("session");
            var configObject            = _this.airbugClientConfig.toObject();
            configObject.github.state   = session.getData().githubState;
            response.render('home', {
                locals: {
                    config: StringUtil.escapeString(JSON.stringify(configObject))
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
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.HomePageController', HomePageController);
