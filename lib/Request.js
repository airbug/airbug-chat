//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var url = require('url');

var Class = require('./Class');
var Event = require('./Event');
var EventDispatcher = require('./EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Request = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(request) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.pathname = url.parse(request.url).pathname;

        this.postData = "";

        this.request = request;

        this.request.setEncoding("utf8");

        var _this = this;
        this.request.addListener("data", function(postDataChunk) {
            _this.processRequestData(postDataChunk);
        });
        this.request.addListener("end", function() {
            _this.processRequestEnd();
        });
        console.log("Request for " + this.pathname + " received.");
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getPathname : function() {
        return this.pathname;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    processRequestData: function(postDataChunk) {
        this.postData += postDataChunk;
        console.log("Received POST data chunk '"+
            postDataChunk + "'.");
    },

    processRequestEnd: function() {
        this.dispatchEvent(new Event(Request.EventTypes.END));
    }

});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

Request.EventTypes = {
    END: 'END'
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Request;
