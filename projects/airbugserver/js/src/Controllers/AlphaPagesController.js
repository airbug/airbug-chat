//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AlphaPagesController')

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

var AlphaPagesController = Class.extend(Obj, {

    _constructor: function(expressRoutesManager){

        this._super();

        this.expressRoutesManager = expressRoutesManager;

    },

    configure: function(){
        var expressRoutesManager = this.expressRoutesManager;
        expressRoutesManager.addAll([
            /** @param {string} method @param {string} routeName, @param {function(req, res)} listener */
            new ExpressRoute('get', '/alpha', function(req, res){
                res.render('alpha', {
                    title: 'airbug',
                    production: config.production
                });
            })
        ]);

        expressRoutesManager.enableAll();
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AlphaPagesController', AlphaPagesController);
