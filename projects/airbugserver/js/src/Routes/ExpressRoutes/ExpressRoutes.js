//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressRoutes')

//@Require('bugroutes.ExpressRoute')
//@Require('bugroutes.Routes')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Routes          = bugpack.require('bugroutes.Routes');
var ExpressRoute    = bugpack.require('bugroutes.ExpressRoute');


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------
var getAlpha = new ExpressRoute('get', '/alpha', function(req, res){ //TODO SUNG Create static pages controller
    res.render('alpha', {
        title: 'airbug',
        production: config.production
    });
});

var routes = [getAlpha];
//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ExpressRoutes = new Routes(routes);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressRoutes', ExpressRoutes);
