
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