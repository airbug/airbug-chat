//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var EventDispatcher = require('./EventDispatcher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Response = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(response) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.response = response;

        this.response.addListener('close', function() {
            this.dispatchEvent(new Event(Response.EventTypes.CLOSE));
        });
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getStatusCode: function(statusCode) {
        return this.response.statusCode;
    },

    setStatusCode: function(statusCode) {
        this.response.statusCode = statusCode;
    },

    getHeader: function(name) {
        return this.response.getHeader(name);
    },

    removeHeader: function(name) {
        this.response.removeHeader(name);
    },

    setHeader: function(name, value) {
        this.response.setHeader(name, value);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    end: function(data, encoding) {
        this.response.end(data, encoding);
    },

    write: function(data, encoding) {
        if (!encoding) {
            encoding = 'utf8';
        }
        this.response.write(data, encoding);
    },

    writeContinue: function() {
        this.response.writeContinue();
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

Response.EventTypes = {
    CLOSE: 'close'
};

//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Response;
