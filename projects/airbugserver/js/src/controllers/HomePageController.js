//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('HomePageController')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomePageController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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

        this.expressApp.get('/app', function(req, res) {

            res.render('home', {
                title: 'airbug',
                config: _this.airbugClientConfig.toJson()
            }, function(error, html)  {
                if (error) {
                    console.error(error);
                    res.send(500, "an error occurred");
                } else {
                    console.log('html:' + html);
                    res.send(html);
                }
            });
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.HomePageController', HomePageController);
