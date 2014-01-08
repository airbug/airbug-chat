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
//@Require('UuidGenerator')
//@Require('airbugserver.IBuildRequestContext')
//@Require('airbugserver.RequestContext')
//@Require('aws.AwsConfig')
//@Require('aws.AwsUploader')
//@Require('aws.S3Api')
//@Require('aws.S3Bucket')
//@Require('bugflow.BugFlow')
//@Require('bugfs.Path')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var path                    = require("path");
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
var UuidGenerator           = bugpack.require('UuidGenerator');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var AwsConfig               = bugpack.require('aws.AwsConfig');
var AwsUploader             = bugpack.require('aws.AwsUploader');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var Path                    = bugpack.require('bugfs.Path');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;
var $forEachParallel        = BugFlow.$forEachParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(assetManager, awsUploader) {

        this._super();

        /**
         * @private
         * @type {AssetManager}
         */
        this.assetManager = assetManager;

        /**
         * @private
         * @type {AwsUploader}
         */
        this.awsUploader = awsUploader;
    },

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {Array<{
     *      name: string,
     *      type: string,
     *      path: string
     * }>} files
     * @param {function(Throwable, Array<Entity>)} callback
     */
    uploadAssets: function(requestContext, files, callback) {
        var _this = this;
        var assets = [];
        $forEachParallel(files, function(flow, file) {
            _this.uploadAsset(requestContext, file, function(throwable, asset) {
                assets.push(asset);
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (throwable) {
                callback(throwable, undefined)
            } else {
                callback(undefined, assets);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      name: string,
     *      type: string,
     *      path: string
     * }} file
     * @param {function(Throwable, Entity)} callback
     */
    uploadAsset: function(requestContext, file, callback) {
        var _this = this;
        var name = file.name;
        var mimeType = file.type;
        var path = file.path;
        var thumbnailPath = file.path + '_t';
        var size = file.size;
        var asset = null;
        var url = null;
        var thumbnailUrl = null;
        var namePath = new Path(name);
        var extName = namePath.getExtName();
        var s3Key = UuidGenerator.generateUuid();
        var thumbnailS3Key = s3Key + '_t';
        if (extName) {
            s3Key = s3Key + '.' + extName;
            thumbnailS3Key = thumbnailS3Key + '.' + extName;
        }

        $series([
            $task(function(flow) {
                // TODO - dkk - make thumbnail
                flow.complete();
            }),
            $task(function(flow) {
                _this.awsUploader.upload(path, s3Key, mimeType, function(error, returnedS3Object) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.awsUploader.upload(thumbnailPath, thumbnailS3Key, mimeType, function(error, returnedS3Object) {
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                var newAsset = _this.assetManager.generateAsset({
                    mimeType: mimeType,
                    name: name,
                    size: size,
                    thumbMimeType: mimeType,
                    thumbnailUrl: thumbnailUrl,
                    url: url
                });
                _this.assetManager.createAsset(newAsset, function(throwable, createdAsset) {
                    asset = createdAsset;
                    console.log("createdAsset:", createdAsset);
                    flow.complete();
                });
            })
        ]).execute(function(throwable) {
            callback(throwable, asset);
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} url
     * @param {function(Throwable, Entity)} callback
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
                var fileObject = {
                    name: "someName", // TODO - dkk - get name
                    path: "getPath" + fileName, // TODO - dkk - get complete path of file that was created
                    type: "someType" // TODO - dkk - attempt to get mime type
                };
                this.uploadAsset(requestContext, fileObject, callback);
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
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetService', AssetService);
