//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('GlobalSocketRoutes')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.Route')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------
var UsersApi, RoomsApi, ConversationsApi, ChatMessagesApi;


GlobalSocketRoutes = {
    enableAllOnSocket: function(socket){
        GlobalSocketRoutes.routes.forEach(function(route){
            route.enableOnSocket(socket);
        })
    },

    routes: [
        new Route("establishUser", UsersApi.establishUser),
        new Route("error", function(){}),
        new Route("disconnect", function(){})
    ]
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.GlobalSocketRoutes', GlobalSocketRoutes);



