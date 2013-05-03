Route = Class.extend(Obj, {
    _constructor: function(name, listener){
        this.super();

        this.name = name;

        this.listener = listener;
    },

    enableOnSocket: function(socket){
        var _this = this;
        socket.on(_this.name, _this.listener);
    }
});