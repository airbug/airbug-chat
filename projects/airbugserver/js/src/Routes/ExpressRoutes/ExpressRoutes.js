//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressRoutes')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Route')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ExpressRoutes = {
    
    enableRoutes: function(){
        
    },
    
    routes: [
        new Route('/alpha', function(req, res){
            res.render('alpha', {
                title: 'airbug',
                production: config.production
            }, 'get')
    ]
};

// app.get('/alpha', function(req, res){
//     res.render('alpha', {
//         title: 'airbug',
//         production: config.production
//     });
// });

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressRoutes', ExpressRoutes);
