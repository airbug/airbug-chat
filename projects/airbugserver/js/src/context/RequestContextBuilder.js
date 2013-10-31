//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RequestContextBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IPreProcessRequest')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var Obj                     = bugpack.require('Obj');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
var IPreProcessRequest      = bugpack.require('bugcall.IPreProcessRequest');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableSeries        = BugFlow.$iterableSeries;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RequestContextBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {List.<IBuildRequestContext}
         */
        this.requestContextBuilderList  = new List();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {IBuildRequestContext} requestContextBuilder
     */
    registerRequestContextBuilder: function(requestContextBuilder) {
        if (Class.doesImplement(requestContextBuilder, IBuildRequestContext)) {
            if (!this.requestContextBuilderList.contains(requestContextBuilder)) {
                this.requestContextBuilderList.add(requestContextBuilder)
            } else {
                throw new Error("requestContextBuilder can only be registered once.");
            }
        } else {
            throw new Error("requestContextBuilder does not implement IBuildRequestContext");
        }
    },


    //-------------------------------------------------------------------------------
    // IPreProcess Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IncomingRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)}  callback
     */
    preProcessRequest: function(request, responder, callback) {
        var type                = RequestContext.Types.BUGCALL;
        this.buildRequestContext(type, request, function(throwable, requestContext) {
            if (!throwable) {
                request.requestContext  = requestContext;
            }
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // Express Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     */
    buildRequestContextForExpress: function(req, res, next) {
        var type = RequestContext.Types.EXPRESS;
        this.buildRequestContext(type, req, function(throwable, requestContext) {
            if (!throwable) {
                req.requestContext = requestContext;
                next();
            } else {
                next(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {} type
     * @param {} request
     * @param {function(Throwable, RequestContext)} callback
     */
    buildRequestContext: function(type, request, callback) {
        var requestContext = new RequestContext(type, request);
        $iterableSeries(this.requestContextBuilderList, function(flow, requestContextBuilder) {
            requestContextBuilder.buildRequestContext(requestContext, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                callback(undefined, requestContext);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(RequestContextBuilder, IPreProcessRequest);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RequestContextBuilder', RequestContextBuilder);
