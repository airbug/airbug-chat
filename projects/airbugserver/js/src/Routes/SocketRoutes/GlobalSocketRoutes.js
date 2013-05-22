//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GlobalSocketRoutes')

//@Require('bugroutes.ExpressRoute')
//@Require('bugroutes.Routes')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var RoomApi             = bugpack.require('airbugserver.RoomApi');
var UserApi             = bugpack.require('airbugserver.UserApi');
var ExpressRoute        = bugpack.require('bugroutes.ExpressRoute');
var Routes              = bugpack.require('bugroutes.Routes');

//-------------------------------------------------------------------------------
// Declare Routes
//-------------------------------------------------------------------------------

var routes = [
    new Route("establishUser", UsersController.establishUser),
    new Route("error", function(error){
        console.log(error);
    }),
    new Route("disconnect", function(){
        
    })
];


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var GlobalSocketRoutes = new Routes(routes);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GlobalSocketRoutes', GlobalSocketRoutes);



