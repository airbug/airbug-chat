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

    _constructor: function(config, expressApp) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.config = config;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp = expressApp;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function(callback) {
        var _this = this;

        this.expressApp.get('/app', function(req, res) {
            //TEST
            console.log("Made it!!");

            res.render('home', {
                title: 'airbug',
                production: _this.config.production
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
        callback();
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.HomePageController', HomePageController);
