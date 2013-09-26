//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RequestContextFactory')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.RequestContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var RequestContext  = bugpack.require('airbugserver.RequestContext');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RequestContextFactory = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @return {RequestContext}
     */
    factoryRequestContext: function(request) {
        var requestContext = new RequestContext();
        requestContext.set("currentUser", request.getHandshake().user.clone());
        requestContext.set("session", request.getHandshake().session.clone());

        //TODO BRN: I don't think that these values need to be cloned since they are not related to a database and therefore can be acted upon all at one time instead of broken up async.

        requestContext.set("handshake", request.getHandshake());
        requestContext.set("callManager", request.getCallManager());
        return requestContext;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RequestContextFactory', RequestContextFactory);
