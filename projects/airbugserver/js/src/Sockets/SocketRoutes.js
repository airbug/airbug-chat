
var UsersApi, RoomsApi, ConversationsApi, ChatMessagesApi;

SocketRoutes = {
    globalRoutes: {
        enable: function(socket){
            var routes = SocketRoutes.establishedUserRoutes.routes;
            routes.forEach(function(route){
                socket.on(route.name, route.listener);
            });
        },
        routes: [new Route("establishUser", UsersApi.establishUser)]
    },
    establishedUserRoutes: {
        enable: function(socket){
            var routes = SocketRoutes.establishedUserRoutes.routes;
            routes.forEach(function(route){
                socket.on(route.name, route.listener);
            });
        },
        routes: [
            new Route("addUserToRoom", RoomsApi.addUserToRoom),
            new Route("newChatMessage", ChatMessagesApi.newChatMessage)
        ]
    }
}

Route = Class.extend(Obj, {
    _constructor: function(name, listener){
        this.super();

        this.name = name;

        this.listener = listener;
    }
})