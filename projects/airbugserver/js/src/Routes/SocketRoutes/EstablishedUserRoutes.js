//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EstablishedUserRoutes')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Route')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------
var UsersApi, RoomsApi, ConversationsApi, ChatMessagesApi;


EstablishedUserRoutes = {
    enableAllOnSocket: function(socket){
        EstablishedUserRoutes.routes.forEach(function(route){
            route.enableOnSocket(socket);
        })
    },

    routes: [
        new Route("addUserToRoom", RoomsApi.addUserToRoom),
        new Route("newChatMessage", ChatMessagesApi.newChatMessage)
    ]
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EstablishedUserRoutes', EstablishedUserRoutes);
