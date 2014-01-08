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
            // TODO - dkk - check to see if files is an object and has a files property. Any other cases?
            console.log("AssetController#/app/uploadAsset data = ", data);
            console.log("AssetController#/app/uploadAsset files = ", files);
            console.log("AssetController#/app/uploadAsset files.files = ", files.files);
            assetService.uploadAssets(requestContext, files.files, function(throwable, entities) {
                console.log("AssetController#/app/uploadAsset entities = ", entities);
                var assetJson = null;
                if (entities) {
                    assetJson = {"files": LiteralUtil.convertToLiteral(entities.toObject())};
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response);
                } else {
                    response.json(assetJson);
                }
            });

//          EXPECTED SUCCESS RESPONSE FORMAT
//            {"files": [
//                {
//                    "name": "picture1.jpg",
//                    "size": 902604,
//                    "url": "http:\/\/example.org\/files\/picture1.jpg",
//                    "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
//                    "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
//                    "deleteType": "DELETE"
//                },
//                {
//                    "name": "picture2.jpg",
//                    "size": 841946,
//                    "url": "http:\/\/example.org\/files\/picture2.jpg",
//                    "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture2.jpg",
//                    "deleteUrl": "http:\/\/example.org\/files\/picture2.jpg",
//                    "deleteType": "DELETE"
//                }
//            ]}
//
//          EXPECTED ERROR RESPONSE FORMAT
//            {"files": [
//                {
//                    "name": "picture1.jpg",
//                    "size": 902604,
//                    "error": "Filetype not allowed"
//                },
//                {
//                    "name": "picture2.jpg",
//                    "size": 841946,
//                    "error": "Filetype not allowed"
//                }
//            ]}
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
            }
            // ,
            //
            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            /*deleteAsset: function(request, responder, callback) {
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
            }*/
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetController', AssetController);
