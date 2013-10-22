//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RequestContextFactory')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.IncomingRequest')


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
var IncomingRequest = bugpack.require('bugcall.IncomingRequest');


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
        if (Class.doesExtend(request, IncomingRequest)) {
            requestContext.set("currentUser", request.getHandshake().user.clone());
            requestContext.set("session", request.getHandshake().session.clone());
        } else {
            requestContext.set("session", request.session.clone());
        }

        return requestContext;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RequestContextFactory', RequestContextFactory);
