//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AssetService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
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
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var path                    = require('path');
var http                    = require('http');
var https                   = require('https');
var fs                      = require('fs');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var UuidGenerator           = bugpack.require('UuidGenerator');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var AwsConfig               = bugpack.require('aws.AwsConfig');
var AwsUploader             = bugpack.require('aws.AwsUploader');
var S3Api                   = bugpack.require('aws.S3Api');
var S3Bucket                = bugpack.require('aws.S3Bucket');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var Path                    = bugpack.require('bugfs.Path');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
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

    _constructor: function(logger, assetManager, assetPusher, awsUploader, imagemagick) {

        this._super();

        /**
         * @private
         * @type {AssetManager}
         */
        this.assetManager   = assetManager;

        /**
         * @private
         * @type {AssetPusher}
         */
        this.assetPusher    = assetPusher;

        /**
         * @private
         * @type {AwsUploader}
         */
        this.awsUploader    = awsUploader;

        /**
         * @private
         * @type {imagemagick}
         */
        this.imagemagick    = imagemagick;

        /**
         * @private
         * @type {Logger}
         */
        this.logger         = logger;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AssetManager}
     */
    getAssetManager: function() {
        return this.assetManager;
    },

    /**
     * @return {AssetPusher}
     */
    getAssetPusher: function() {
        return this.assetPusher;
    },

    /**
     * @return {AwsUploader}
     */
    getAwsUploader: function() {
        return this.awsUploader;
    },

    /**
     * @return {imagemagick}
     */
    getImagemagick: function() {
        return this.imagemagick;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {string} url
     * @param {function(Throwable, Entity)} callback
     */
    addAssetFromUrl: function(requestContext, url, callback) {
        var _this = this;
        // TODO - dkk - Parse URL to get filename. If no filename then generate one //Cleanup
        var filename = url.match(/([^\/]+)(\.\w+$)/)[0];
        if(!filename){
            filename = "example"    //TODO SUNG Is it possible for a legitimate image url to not have a filename??
                                    // Maybe this should actually return an exception
        }
        console.log("filename:", filename); //Cleanup

        var file = fs.createWriteStream(filename);

        http.get(url, function(response) {
            var type = response.headers['content-type']; //TODO SUNG validate
            var size = response.headers['content-length']; //TODO SUNG validate that it is within our file size limits
            response.pipe(file);
            file.on('finish', function() {
                file.close();
                console.log("file:", file); //Cleanup
                var path = file.path;
                var fileObject = {
                    name: filename,
                    path: path,
                    type: type,
                    size: size
                };
                console.log("fileObject:", fileObject); //Cleanup
                _this.uploadAsset(requestContext, fileObject, callback);
            });
        });
        // TODO - dkk - handle errors
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} assetId
     * @param {function(Throwable=)} callback
     */
    deleteAsset: function(requestContext, assetId, callback) {
        var _this   = this;
        var asset   = null;
        $series([
            $task(function(flow) {
                _this.assetManager.retrieveAsset(assetId, function(throwable, retrievedAsset) {
                    if (!throwable) {
                        if (retrievedAsset) {
                            asset = retrievedAsset;
                            flow.complete();
                        } else {
                            flow.error(new Exception("NotFound", {}, "Could not find Asset with the id '" + assetId + "'"));
                        }
                    } else {
                        flow.error(throwable);
                    }
                });
            }),
            $task(function(flow) {
                _this.assetManager.deleteAsset(asset, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {S3Object} s3Object
     * @return {string}
     */
    getObjectUrl: function(s3Object) {
        var props = this.awsUploader.getProps();
        var awsConfig = new AwsConfig(props.awsConfig);
        var s3Bucket = new S3Bucket({
            name: props.bucket || props['local-bucket']
        });
        var s3Api = new S3Api(awsConfig);
        return s3Api.getObjectURL(s3Object, s3Bucket);
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} assetId
     * @param {function(Throwable, ChatMessage=} callback
     */
    retrieveAsset: function(requestContext, assetId, callback) {
        var _this           = this;
        var call     = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {Asset} */
        var asset           = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrieveAsset(assetId, function(throwable, returnedAsset) {
                        if (!throwable) {
                            if (returnedAsset) {
                                asset = returnedAsset;
                                flow.complete(throwable);
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find Asset with the id '" + assetId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.assetPusher.meldCallWithAsset(call.getCallUuid(), asset, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.assetPusher.pushAssetToCall(asset, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, asset);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} assetIds
     * @param {function(Throwable, Map.<string, Asset>=)} callback
     */
    retrieveAssets: function(requestContext, assetIds, callback) {
        var _this               = this;
        /** @type {Map.<string, Asset>} */
        var assetMap            = null;
        var currentUser         = requestContext.get("currentUser");
        var call                = requestContext.get("call");
        var assetManager        = this.assetManager;
        var mappedException     = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    assetManager.retrieveAssets(assetIds, function(throwable, returnedAssetMap) {
                        if (!throwable) {
                            assetMap = returnedAssetMap.clone();
                            returnedAssetMap.forEach(function(asset, key) {
                                if (asset === null) {
                                    assetMap.remove(key);
                                    if (!mappedException) {
                                        mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                    }
                                    mappedException.putThrowable(key, new Exception("NotFound", {objectId: key}, "Could not find Asset by the id '" + key + "'"));
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.assetPusher.meldCallWithAssets(call.getCallUuid(), assetMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.assetPusher.pushAssetsToCall(assetMap.getValueArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(mappedException, assetMap);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users cannot access Assets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array<{
     *      name: string,
     *      type: string,
     *      path: string
     * }>} files
     * @param {function(Throwable, Array<Entity>=)} callback
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
            if (!throwable) {
                callback(null, assets);
            } else {
                callback(throwable);
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
        var _this           = this;
        var name            = file.name;
        var midsizePath     = file.path + '_m';
        var mimeType        = file.type;
        var path            = file.path;
        var thumbnailPath   = file.path + '_t';
        var size            = file.size;
        var asset           = null;
        var assetWidth      = null;
        var assetHeight     = null;
        var url             = null;
        var thumbnailUrl    = null;
        var midsizeUrl      = null;
        var namePath        = new Path(name);
        var extName         = namePath.getExtName();
        var s3Key           = UuidGenerator.generateUuid();
        var thumbnailS3Key  = s3Key + '_t';
        var midsizeS3Key    = s3Key + '_m';
        if (extName) {
            s3Key           = s3Key + extName;
            thumbnailS3Key  = thumbnailS3Key + extName;
            midsizeS3Key    = midsizeS3Key + extName;
        }
        var props = this.awsUploader.getProps();
        props.options = props.options || {};
        props.options.acl = 'public-read';

        // NOTE - dkk - do all resizes before uploading. The s3 lib deletes files after upload.
        $series([
            $task(function(flow) {
                var im = _this.imagemagick;
                im.identify(path, function(error, features){
                    // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
                    if (error) {
                        console.log("error getting image features: ", error);
                    } else {
                        assetWidth  = features.width;
                        assetHeight = features.height;
                    }
                    flow.complete(error);

                });
            }),
            $task(function(flow) {
                var im = _this.imagemagick;
                im.resize({srcPath: path, dstPath: thumbnailPath, width: 80}, function(error) {
                    if (error) {
                        console.log("error resizing image: ", error);
                    }
                    flow.complete(error);
                })
            }),
            $task(function(flow) {
                var im = _this.imagemagick;
                if (assetWidth > 600) {
                    var newHeight = (600 / assetWidth) * assetHeight;
                    im.resize({srcPath: path, dstPath: midsizePath, width: 600, height: newHeight}, function(error) {
                        if (error) {
                            console.log("error resizing midsize image: ", error);
                        }
                        flow.complete(error);
                    })
                } else {
                    // no need to resize, we'll use the full-sized url later on.
                    flow.complete();
                }
            }),
            $task(function(flow) {
                _this.awsUploader.upload(path, s3Key, mimeType, function(error, returnedS3Object) {
                    if (error) {
                        console.log("error uploading asset: ", error);
                    }
                    url = _this.getObjectUrl(returnedS3Object);
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                _this.awsUploader.upload(thumbnailPath, thumbnailS3Key, mimeType, function(error, returnedS3Object) {
                    if (error) {
                        console.log("error uploading asset thumbnail: ", error);
                    }
                    thumbnailUrl = _this.getObjectUrl(returnedS3Object);
                    flow.complete(error);
                });
            }),
            $task(function(flow) {
                if (assetWidth < 600) {
                    midsizeUrl = url;
                    flow.complete();
                } else {
                    _this.awsUploader.upload(midsizePath, midsizeS3Key, mimeType, function(error, returnedS3Object) {
                        if (error) {
                            console.log("error uploading midsize asset thumbnail: ", error);
                        }
                        midsizeUrl = _this.getObjectUrl(returnedS3Object);
                        flow.complete(error);
                    });
                }
            }),
            $task(function(flow) {
                var newAsset = _this.assetManager.generateAsset({
                    midsizeMimeType: mimeType,
                    midsizeUrl: midsizeUrl,
                    mimeType: mimeType,
                    name: name,
                    size: size,
                    thumbnailMimeType: mimeType,
                    thumbnailUrl: thumbnailUrl,
                    url: url
                });
                _this.assetManager.createAsset(newAsset, function(throwable, createdAsset) {
                    asset = createdAsset;
                    console.log('createdAsset:', createdAsset);
                    flow.complete();
                });
            })
        ]).execute(function(throwable) {
            callback(throwable, asset);
        });
    },

    /**
     * @private
     * @param {string} assetId
     * @param {function(Throwable, Asset=)} callback
     */
    dbRetrieveAsset: function(assetId, callback) {
        var asset           = null;
        var assetManager    = this.assetManager;
        $task(function(flow) {
            assetManager.retrieveAsset(assetId, function(throwable, returnedAsset) {
                if (!throwable) {
                    if (returnedAsset) {
                        asset = returnedAsset;
                    } else {
                        throwable = new Exception('NotFound', {objectId: assetId});
                    }
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                callback(null, asset);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AssetService).with(
    module("assetService")
        .args([
            arg().ref("logger"),
            arg().ref("assetManager"),
            arg().ref("assetPusher"),
            arg().ref("awsUploader"),
            arg().ref("imagemagick")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetService', AssetService);
