//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RequestContextBuilder')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IPreProcessRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var RequestContext      = bugpack.require('airbugserver.RequestContext');
var IncomingRequest     = bugpack.require('bugcall.IncomingRequest');
var IPreProcessRequest  = bugpack.require('bugcall.IPreProcessRequest');


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
        var type                = RequestContext.types.BUGCALL;
        var requestContext      = this.buildRequestContext(type, request);
        request.requestContext  = requestContext;
        callback();
    },

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     */
    buildRequestContextForExpress: function(req, res, next){
        var type = RequestContext.types.EXPRESS;
        var requestContext = this.buildRequestContext(type, req);
        req.requestContext = requestContext;
        next();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {} type
     * @param {} request
     * @return {RequestContext}
     */
    buildRequestContext: function(type, request) {
        var requestContext = new RequestContext(type, request);
        this.setSession(request, requestContext);
        this.setCurrentUser(request, requestContext);
        return requestContext;
    },

    /**
     * @private
     */
    setCurrentUser: function(request, requestContext){
        if (Class.doesExtend(request, IncomingRequest)) {
            requestContext.set("currentUser", request.getHandshake().user.clone());
        } else {
            // TODO retrieve from db
            // requestContext.set("session", request.session.clone());
        }
    },

    /**
     * @private
     */
    setSession: function(request, requestContext){
        if (Class.doesExtend(request, IncomingRequest)) {
            // requestContext.set("currentUser", request.getHandshake().user.clone());
            requestContext.set("session", request.getHandshake().session.clone());
        } else {
            requestContext.set("session", request.session); //no method clone on this version of session
        }
    }
});

Class.implement(RequestContextBuilder, IPreProcessRequest);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RequestContextBuilder', RequestContextBuilder);
