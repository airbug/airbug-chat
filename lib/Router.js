//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var List = require('./List');
var Obj = require('./Obj');
var PathMap = require('./PathMap');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Router = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        //TODO BRN: ServerSideApplications should add the routes to the Router. This way multiple servers could be declared
        //in the same runtime sandbox and we could understand which route handlers apply to which servers.

        this.handlerList = new List();

        this.handlerPathMap = new PathMap();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    addHandler: function(handler) {
        this.handlerList.add(handler);
        this.mapHandler(handler);
    },

    mapHandler: function(handler) {
        this.handlerPathMap.put(handler.getPathToken(), handler);
        //TODO BRN: We need a way to be able to turn logging on and off.
        console.log("Mapping path token [" + handler.getPathToken() + "]");
    },

    route: function(requestObject, responseObject) {
        var pathname = requestObject.getPathname();
        var handler = this.handlerPathMap.get(pathname);
        if (handler) {
            handler.handle(requestObject, responseObject);
        } else {
            //TODO BRN (IMPROVEMENT): Create a 404 handling mechanism.
            responseObject.setStatusCode(404);
        }
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Router;
