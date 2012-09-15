//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var http = require('http');
var url = require('url');

var Class = require('./Class');
var Request = require('./Request');
var Response = require('./Response');
var Router = require('./Router');
var Server = require('./Server');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HttpServer = Class.extend(Server, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.httpServer = http.createServer();

        this.router = new Router();

        var _this = this;
        this.httpServer.addListener('request', function(request, response) {
            _this.processServerRequest(request, response);
        });
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getRouter: function() {
        return this.router;
    },


    //-------------------------------------------------------------------------------
    // Server Implementation
    //-------------------------------------------------------------------------------

    startServer : function() {
        this._super();
        this.httpServer.listen(this.port);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    addHandler: function(handler) {
        this.router.addHandler(handler);
    },

    processServerRequest : function(request, response) {
        var requestObject = new Request(request);
        var responseObject = new Response(response);
        var _this = this;
        requestObject.addEventListener(Request.EventTypes.END, function(event) {
            _this.router.route(requestObject, responseObject);
            responseObject.end();
        });
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = HttpServer;
