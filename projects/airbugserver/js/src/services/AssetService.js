/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AssetService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Collections')
//@Require('Exception')
//@Require('Flows')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('Url')
//@Require('UuidGenerator')
//@Require('bugaws.AwsConfig')
//@Require('bugaws.AwsUploader')
//@Require('bugaws.S3Api')
//@Require('bugaws.S3Bucket')
//@Require('bugfs.Path')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var path                = require('path');
    var http                = require('http');
    var https               = require('https');
    var fs                  = require('fs');


    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Collections         = bugpack.require('Collections');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var MappedThrowable     = bugpack.require('MappedThrowable');
    var Obj                 = bugpack.require('Obj');
    var Url                 = bugpack.require('Url');
    var UuidGenerator       = bugpack.require('UuidGenerator');
    var AwsConfig           = bugpack.require('bugaws.AwsConfig');
    var AwsUploader         = bugpack.require('bugaws.AwsUploader');
    var S3Api               = bugpack.require('bugaws.S3Api');
    var S3Bucket            = bugpack.require('bugaws.S3Bucket');
    var Path                = bugpack.require('bugfs.Path');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $series             = Flows.$series;
    var $task               = Flows.$task;
    var $forEachParallel    = Flows.$forEachParallel;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var AssetService = Class.extend(Obj, {

        _name: "airbugserver.AssetService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {AssetManager} assetManager
         * @param {AssetPusher} assetPusher
         * @param {AwsUploader} awsUploader
         * @param {imagemagick} imagemagick
         */
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
         * @param {string} urlString
         * @param {function(Throwable, Entity=)} callback
         */
        addAssetFromUrl: function(requestContext, urlString, callback) {
            var _this       = this;
            var url         = Url.parse(urlString);
            var urlPath     = url.getPath();
            if (urlPath) {

            } else {
                return callback(new Exception("BadRequest", {}, ""));
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
                                        mappedException.putCause(key, new Exception("NotFound", {objectId: key}, "Could not find Asset by the id '" + key + "'"));
                                    }
                                });
                            }
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.assetPusher.meldCallWithAssets(call.getCallUuid(), assetMap.toValueArray(), function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.assetPusher.pushAssetsToCall(assetMap.toValueArray(), call.getCallUuid(), function(throwable) {
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
         * @param {Array.<{
         *      name: string,
         *      type: string,
         *      path: string
         * }>} files
         * @param {function(Throwable, Collection.<Entity>=)} callback
         */
        uploadAssets: function(requestContext, files, callback) {
            var _this   = this;
            var assets  = Collections.collection();
            $forEachParallel(files, function(flow, file) {
                _this.uploadAsset(requestContext, file, function(throwable, asset) {
                    assets.add(asset);
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

    bugmeta.tag(AssetService).with(
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
});
