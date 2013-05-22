//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EstablishedUserRoutes')

//@Require('bugroutes.ExpressRoute')
//@Require('bugroutes.Routes')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Routes              = bugpack.require('bugroutes.Routes');
var ExpressRoute        = bugpack.require('bugroutes.ExpressRoute');


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------

var routes = [
    new Route("addUserToRoom",  "RoomsController.addUserToRoom"),
    new Route("newChatMessage", "ChatMessageController.newChatMessage")
];


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EstablishedUserRoutes = new Routes(routes);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EstablishedUserRoutes', EstablishedUserRoutes);
