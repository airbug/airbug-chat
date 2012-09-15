//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Annotate = require('./annotate/Annotate');
var Class = require('./Class');
var Handler = require('./Handler');
var HttpServer = require('./HttpServer');
var Module = require('./Module');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HttpServerModule = Class.extend(Module, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.httpServer = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    deployModule: function() {
        this.httpServer = new HttpServer();
        this.httpServer.start();
    },

    initializeModule: function() {

        // NOTE BRN: We want to add this here and not globally since we are trying to isolate this server's router from
        // other server's routers.

        var _this = this;
        Annotate.registerAnnotationProcessor('Handler', function(annotation) {
            var handler = new Handler(annotation.getReference(), annotation.getParamList().getAt(0));
            _this.httpServer.addHandler(handler);
        });
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HttpServerModule;
