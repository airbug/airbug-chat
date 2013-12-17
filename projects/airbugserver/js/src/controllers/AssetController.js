//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetController')

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(expressApp, bugCallRouter, assetService) {

        this._super(expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AssetService}
         */
        this.assetService            = assetService;

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AssetService}
     */
    getAssetService: function() {
        return this.assetService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function() {
        var _this           = this;
        var expressApp      = this.getExpressApp();
        var assetService    = this.getAssetService();

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/app/uploadAsset', function(request, response) {
            var requestContext      = request.requestContext;
            var data                = request.body;
            var files               = request.files;
            // TODO: need to iterate over files list. We can (and should) do these in parallel.
            assetService.uploadAsset(requestContext, file, function(throwable, entity) {
                var assetJson = null;
                if (entity) {
                    assetJson = LiteralUtil.convertToLiteral(entity.toObject());
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(assetJson);
                }
            });
        });


        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        this.bugCallRouter.addAll({
            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            addAssetFromUrl: function(request, responder, callback) {
                console.log("AssetController#addAssetFromUrl");
                var requestContext = request.requestContext;
                // TODO - dkk - extract url from request
                var url = "";
                assetService.addAssetFromUrl(requestContext, url, function(throwable, asset) {
                    _this.processCreateResponse(responder, throwable, asset, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            deleteAsset: function(request, responder, callback) {
                console.log("AssetController#deleteAsset");
                var requestContext = request.requestContext;
                // TODO - dkk - get asset id from request
                // TODO - dkk - we should not be making this request as assets are not owned by users.
                assetService.deleteAsset(requestContext, function(throwable, asset) {
                    if (!throwable) {
                        _this.sendSuccessResponse(responder, {}, callback);
                    } else {
                        _this.processThrowable(responder, throwable, callback);
                    }
                });
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetController', AssetController);
