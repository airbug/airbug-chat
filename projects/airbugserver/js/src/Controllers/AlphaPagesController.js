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
        
        this.expressRoutesManager.addAll([

            new ExpressRoute('get', '/alpha', function(req, res){
                res.render('alpha', {
                    title: 'airbug',
                    production: config.production
                });
            })
        ]);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AlphaPagesController', AlphaPagesController);
