Route = Class.extend(Obj, {
    _constructor: function(name, listener, method){
        this.super();

        this.name = name;

        this.listener = listener;

        this.method = method;
    },

    enableOnSocket: function(socket){
        var _this = this;
        socket.on(_this.name, _this.listener);
    },

    enableOnApp: function(app){
        app[this.method](this.name, this.listener);
    }
});
