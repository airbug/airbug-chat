//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetService')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('bugflow.BugFlow')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var http                    = require('http');
var https                   = require('https');
var fs                      = require('fs');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(assetManager) {

        this._super();

        /**
         * @private
         * type {AssetManager}
         */
        this.assetManager = assetManager;
    },

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {string} file
     * @param {string} assetName
     * @param {string} contentType
     * @param {function(Throwable, Entity)} callback
     */
    uploadAsset: function(requestContext, file, assetName, contentType, callback) {
        // upload to s3
        // create asset
        // call callback
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} url
     * @param {function(Throwable, Asset)} callback
     */
    addAssetFromUrl: function(requestContext, url, callback) {
        var contentType = undefined;
        var assetName = "";

        // TODO - dkk - Parse URL to get filename. If no filename then generate one
        var fileName = "";
        // TODO - dkk - get content type on get request.

        var file = fs.createWriteStream(fileName);
        var request = http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();
                this.uploadAsset(requestContext, fileName, assetName, contentType, callback);
            });
        });
        // TODO - dkk - handle errors
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} assetId
     * @param {function(Throwable, asset)} callback
     */
    deleteAsset: function(requestContext, assetId, callback) {
        var _this = this;
        var asset = undefined;
        $series([
            $task(function(flow) {
                _this.assetManager.retrieveAsset(assetId, function(throwable, retrievedAsset) {
                    asset = retrievedAsset;
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.assetManager.deleteAsset(asset, function(throwable) {
                    flow.complete(throwable);
                })
            })
        ]).execute(function(throwable) {
            callback(throwable);
        });
        this.assetManager.deleteAsset()
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetService', AssetService);
