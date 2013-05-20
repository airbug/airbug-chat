//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GlobalSocketRoutes')

//@Require('airbugserver.ChatMessagesApi')
//@Require('airbugserver.ConversationsApi')
//@Require('airbugserver.RoomsApi')
//@Require('airbugserver.UsersApi')
//@Require('bugroutes.ExpressRoute')
//@Require('bugroutes.Routes')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ChatMessagesApi     = bugpack.require('airbugserver.ChatMessagesApi');
var ConversationsApi    = bugpack.require('airbugserver.ConversationsApi');
var RoomsApi            = bugpack.require('airbugserver.RoomsApi');
var UsersApi            = bugpack.require('airbugserver.UsersApi');
var ExpressRoute        = bugpack.require('bugroutes.ExpressRoute');
var Routes              = bugpack.require('bugroutes.Routes');

//-------------------------------------------------------------------------------
// Declare Routes
//-------------------------------------------------------------------------------

var routes = [
    new Route("establishUser", UsersApi.establishUser),
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



