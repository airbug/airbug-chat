//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EstablishedUserRoutes')

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

var Routes              = bugpack.require('bugroutes.Routes');
var ExpressRoute        = bugpack.require('bugroutes.ExpressRoute');
var UsersApi            = bugpack.require('airbugserver.UsersApi');
var RoomsApi            = bugpack.require('airbugserver.RoomsApi');
var ConversationsApi    = bugpack.require('airbugserver.ConversationsApi');
var ChatMessagesApi     = bugpack.require('airbugserver.ChatMessagesApi');


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------
var getAlpha = new ExpressRoute('get', '/alpha', function(req, res){
    res.render('alpha', {
        title: 'airbug',
        production: config.production
    });
});

var routes = [getAlpha];
//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UsersApi, RoomsApi, ConversationsApi, ChatMessagesApi;

var routes: [
    new Route("addUserToRoom", RoomsApi.addUserToRoom),
    new Route("newChatMessage", ChatMessagesApi.newChatMessage)
];

EstablishedUserRoutes = new Routes(routes);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EstablishedUserRoutes', EstablishedUserRoutes);
