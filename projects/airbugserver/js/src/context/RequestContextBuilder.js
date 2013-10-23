//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RequestContextBuilder')

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

var RequestContextBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------
    // IPreProcess Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)}  callback
     */
    preProcessRequest: function(request, responder, callback) {

    },

    /**
     * @param {IncomingRequest} request
     * @return {RequestContext}
     */
    buildRequestContext: function(type, request) {
        // from requestcontextfactory:
        var requestContext = new RequestContext(type, request);
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

bugpack.export('airbugserver.RequestContextBuilder', RequestContextBuilder);
