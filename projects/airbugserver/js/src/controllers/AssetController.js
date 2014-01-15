//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetController')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


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
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, assetService) {

        this._super(controllerManager, expressApp, bugCallRouter);


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
    // Controller Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this           = this;
        var expressApp      = this.getExpressApp();
        var assetService    = this.getAssetService();

        //-------------------------------------------------------------------------------
        // Express Routes
        //-------------------------------------------------------------------------------

        expressApp.post('/api/uploadAsset', function(request, response) {
            var requestContext      = request.requestContext;
            var data                = request.body;
            var files               = request.files;
            // TODO - dkk - check to see if files is an object and has a files property. Any other cases?
            console.log("AssetController#/api/uploadAsset data = ", data);
            console.log("AssetController#/api/uploadAsset files = ", files);
            console.log("AssetController#/api/uploadAsset files.files = ", files.files);
            assetService.uploadAssets(requestContext, files.files, function(throwable, entities) {
                console.log("AssetController#/api/uploadAsset entities:", entities);
                var assetJson = null;
                if (entities) {
                    entities = entities.map(function(entity){
                        return entity.toObject();
                    })
                    assetJson = {"files": LiteralUtil.convertToLiteral(entities)};
                }
                if (throwable) {
                    _this.processAjaxThrowable(throwable, response); //TODO Update this and service layer to match expected response props
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

        this.getBugCallRouter().addAll({
            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            addAssetFromUrl: function(request, responder, callback) {
                console.log("AssetController#addAssetFromUrl");
                var requestContext = request.requestContext;
                var data = request.getData();
                var url = data.url;

                if(url){
                    assetService.addAssetFromUrl(requestContext, url, function(throwable, asset) {
                        _this.processCreateResponse(responder, throwable, asset, callback);
                    });
                } else {
                    //throw exception
                }
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveAsset:   function(request, responder, callback) {
                var data                = request.getData();
                var assetId              = data.objectId;
                var requestContext      = request.requestContext;
                assetService.retrieveAsset(requestContext, assetId, function(throwable, asset) {
                    _this.processRetrieveResponse(responder, throwable, asset, callback);
                });
            },

            retrieveAssets: function(request, responder, callback) {

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
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AssetController).with(
    module("assetController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("assetService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetController', AssetController);
