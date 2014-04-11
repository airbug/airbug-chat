//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserAssetService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.UserAsset')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Set                     = bugpack.require('Set');
var UserAsset               = bugpack.require('airbugserver.UserAsset');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
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

var UserAssetService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(logger, userAssetManager, userAssetPusher, userImageAssetStreamManager, userImageAssetStreamPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {UserAssetManager}
         */
        this.userAssetManager               = userAssetManager;

        /**
         * @private
         * @type {UserAssetPusher}
         */
        this.userAssetPusher                = userAssetPusher;

        /**
         * @private
         * @type {UserImageAssetStreamManager}
         */
        this.userImageAssetStreamManager    = userImageAssetStreamManager;

        /**
         * @private
         * @type {UserImageAssetStreamPusher}
         */
        this.userImageAssetStreamPusher     = userImageAssetStreamPusher;
    },


    //-------------------------------------------------------------------------------
    // Service Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      assetId: string,
     *      createdAt: Date,
     *      name: string,
     *      updatedAt: Date,
     *      userId: string
     * }} userAssetData
     * @param {function(Throwable, UserAsset=)} callback
     */
    createUserAsset: function(requestContext, userAssetData, callback) {
        var _this = this;
        var call                    = requestContext.get('call');
        var callCallUuid            = call.getCallUuid();
        var currentUser             = requestContext.get('currentUser');
        var currentUserId           = currentUser.getId();
        /** @type {UserAsset} */
        var userAsset               = null;
        var userAssetManager        = this.userAssetManager;

        if (currentUser.isNotAnonymous() && currentUser.getId() === userAssetData.userId) {
            $series([
                $task(function(flow) {
                    var newUserAsset = userAssetManager.generateUserAsset(userAssetData);
                    userAssetManager.createUserAsset(newUserAsset, function(throwable, returnedUserAsset) {
                        if (!throwable) {
                            if (returnedUserAsset) {
                                userAsset = returnedUserAsset;
                                flow.complete();
                            } else {
                                flow.error(new Exception('NotFound'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    userAssetManager.populateUserAsset(userAsset, ['user', 'asset'], function(throwable) {
                        if (throwable) {
                            flow.error(throwable);
                        } else {
                            flow.complete(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAsset(callCallUuid, userAsset, function(throwable) {
                        if (throwable) {
                            flow.error(throwable);
                        } else {
                            flow.complete(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetToCall(userAsset, callCallUuid, function(throwable) {
                        if (throwable) {
                            flow.error(throwable);
                        } else {
                            flow.complete(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    //TODO SUNG: Run this task only if the userAsset is of type "image" once we implement different types

                    var userImageAssetStream = _this.userImageAssetStreamManager.generateUserImageAssetStream({
                        id: currentUserId
                    });
                    _this.userAssetPusher.streamUserImageAsset(userImageAssetStream, userAsset, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, userAsset);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot create UserAssets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userAssetId
     * @param {function(Throwable, UserAsset=)} callback
     */
    deleteUserAsset: function(requestContext, userAssetId, callback) {
        var _this                   = this;
        var call             = requestContext.get('call');
        var callCallUuid     = call.getCallUuid();
        var currentUser             = requestContext.get('currentUser');
        /** @type {UserAsset} */
        var userAsset               = null;
        var userAssetManager        = this.userAssetManager;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAsset(userAssetId, function(throwable, returnedUserAsset) {
                        if (!throwable) {
                            if (returnedUserAsset) {
                                userAsset = returnedUserAsset;
                                flow.complete();
                            } else {
                                flow.error(new Exception('NotFound', {}, "Could not find UserAsset with the id '" + userAssetId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    userAssetManager.deleteUserAsset(userAsset, function(throwable) {
                        if (!throwable) {
                            flow.complete();
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushRemoveUserAssetToCall(userAsset, callCallUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.unmeldUserWithUserAsset(currentUser, userAsset, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, userAsset);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users do not have access to UserAssets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userAssetId
     * @param {string} userAssetName
     * @param {function(Throwable, UserAsset)} callback
     */
    renameUserAsset: function(requestContext, userAssetId, userAssetName, callback) {
        var _this                   = this;
        var call             = requestContext.get('call');
        var callCallUuid     = call.getCallUuid();
        var currentUser             = requestContext.get('currentUser');
        /** @type {UserAsset} */
        var userAsset               = null;
        var userAssetManager        = this.userAssetManager;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAsset(userAssetId, function(throwable, returnedUserAsset) {
                        if (!throwable) {
                            if (returnedUserAsset) {
                                userAsset = returnedUserAsset;
                                flow.complete();
                            } else {
                                flow.error(new Exception('NotFound'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    userAsset.setName(userAssetName);
                    userAssetManager.updateUserAsset(userAsset, function(throwable, returnedUserAsset) {
                        if (!throwable) {
                            userAsset = returnedUserAsset;
                            flow.complete(throwable);
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    userAssetManager.populateUserAsset(userAsset, ['user', 'asset'], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAsset(callCallUuid, userAsset, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetToCall(userAsset, callCallUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, userAsset);
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
     * @param {string} userAssetId
     * @param {function(Throwable, UserAsset=)} callback
     */
    retrieveUserAsset: function(requestContext, userAssetId, callback) {
        var _this                   = this;
        var call             = requestContext.get('call');
        var callCallUuid     = call.getCallUuid();
        var currentUser             = requestContext.get('currentUser');
        /** @type {UserAsset} */
        var userAsset               = null;
        var userAssetManager        = this.userAssetManager;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAsset(userAssetId, function(throwable, returnedUserAsset) {
                        if (!throwable) {
                            if (returnedUserAsset) {
                                userAsset = returnedUserAsset;
                                flow.complete();
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find UserAsset with id '" + userAssetId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAsset(callCallUuid, userAsset, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetToCall(userAsset, callCallUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, userAsset);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access UserAssets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} userAssetIds
     * @param {function(Throwable, Map.<string, UserAsset>=)} callback
     */
    retrieveUserAssets: function(requestContext, userAssetIds, callback) {
        var _this                   = this;
        var call             = requestContext.get('call');
        var callCallUuid     = call.getCallUuid();
        var currentUser             = requestContext.get('currentUser');
        var mappedException         = null;
        var userAssetManager        = this.userAssetManager;
        /** @type {Map.<string, UserAsset>} */
        var userAssetMap            = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAssets(userAssetIds, function(throwable, returnedUserAssetMap) {
                        if (!throwable) {
                            userAssetMap = returnedUserAssetMap.clone();
                            returnedUserAssetMap.forEach(function(userAsset, key) {
                                if (userAsset === null) {
                                    userAssetMap.remove(key);
                                    if (!mappedException) {
                                        mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                    }
                                    mappedException.putThrowable(key, new Exception('NotFound', {objectId: key}, "Could not find UserAsset with id '" + key + "'"));
                                }
                            });
                            flow.complete();
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAssets(callCallUuid, userAssetMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetsToCall(userAssetMap.getValueArray(), callCallUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(mappedException, userAssetMap);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access UserAssets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, List.<UserAsset>)} callback
     */
    retrieveUserAssetsByUserId: function(requestContext, userId, callback) {
        var _this = this;
        var currentUser = requestContext.get('currentUser');
        var call = requestContext.get('call');
        var mappedException = null;
        var userAssetManager = this.userAssetManager;
        /** @type {List.<UserAsset>} */
        var userAssetList = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAssetsByUserId(userId, function(throwable, returnedUserAssetList) {
                        if (!throwable) {
                            userAssetList = returnedUserAssetList;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAssets(call.getCallUuid(), userAssetList.toArray(), function(throwable) {
                       flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetsToCall(userAssetList.toArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(mappedException, userAssetList);
                } else {
                    callback(throwable, null);
                }
            });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, List.<UserAsset>=)} callback
     */
    retrieveUserImageAssetsByUserId: function(requestContext, userId, callback) {
        var _this = this;
        var currentUser = requestContext.get('currentUser');
        var call        = requestContext.get('call');
        var mappedException = null;
        var userAssetManager = this.userAssetManager;
        /** @type {List.<UserAsset>} */
        var userImageAssetList = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserImageAssetsByUserId(userId, function(throwable, returnedImageUserAssetList) {
                        if (!throwable) {
                            userImageAssetList = returnedImageUserAssetList;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAssets(call.getCallUuid(),
                        userImageAssetList.toArray(), function(throwable) {
                            flow.complete(throwable);
                        });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetsToCall(userImageAssetList.toArray(),
                        call.getCallUuid(), function(throwable) {
                            flow.complete(throwable);
                        });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(mappedException, userImageAssetList);
                    } else {
                        callback(throwable, null);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users are not allowed to access UserAssets"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, List.<UserAsset>=)} callback
     */
    retrieveUserAssetsByUserIdSortByCreatedAt: function(requestContext, userId, callback) {
        var _this = this;
        var currentUser = requestContext.get('currentUser');
        var call        = requestContext.get('call');
        var mappedException = null;
        var userAssetManager = this.userAssetManager;
        /** @type {List.<UserAsset>} */
        var userImageAssetList = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    userAssetManager.retrieveUserAssetsByUserIdSortByCreatedAt(userId, function(throwable, returnedImageUserAssetList) {
                        if (!throwable) {
                            userImageAssetList = returnedImageUserAssetList;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.meldCallWithUserAssets(call.getCallUuid(),
                        userImageAssetList.toArray(), function(throwable) {
                            flow.complete(throwable);
                        });
                }),
                $task(function(flow) {
                    _this.userAssetPusher.pushUserAssetsToCall(userImageAssetList.toArray(),
                        call.getCallUuid(), function(throwable) {
                            flow.complete(throwable);
                        });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(mappedException, userImageAssetList);
                    } else {
                        callback(throwable, null);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users are not allowed to access UserAssets"));
        }
    },


    //-------------------------------------------------------------------------------
    // Private
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Map.<string, UserAsset>} userAssetMap
     * @param {function(Throwable=)} callback
     */
    dbPopulateUserAssets: function(userAssetMap, callback) {
        var _this               = this;
        var userAssetArray      = userAssetMap.getValueArray();
        $forEachParallel(userAssetArray, function(flow, userAsset) {
            _this.userAssetManager.populateUserAsset(userAsset, ['user', 'asset'], function(throwable, userAsset) {
                if (!throwable) {
                    flow.complete();
                } else {
                    flow.error(throwable);
                }
            });
        }).execute(function(throwable) {
            callback(throwable);
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAssetService).with(
    module('userAssetService')
        .args([
            arg().ref('logger'),
            arg().ref('userAssetManager'),
            arg().ref('userAssetPusher'),
            arg().ref('userImageAssetStreamManager'),
            arg().ref('userImageAssetStreamPusher')
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAssetService', UserAssetService);
