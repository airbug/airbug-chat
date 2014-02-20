//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyService')
//@Autoload

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
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var UuidGenerator           = bugpack.require('UuidGenerator');
var IBuildRequestContext    = bugpack.require('airbugserver.IBuildRequestContext');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
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

var BetaKeyService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(betaKeyManager, betaKeyPusher) {

        this._super();

        /**
         * @private
         * @type {BetaKeyManager}
         */
        this.betaKeyManager = betaKeyManager;

        /**
         * @private
         * @type {BetaKeyPusher}
         */
        this.betaKeyPusher = betaKeyPusher;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} betaKey
     * @param {function(?Error)} callback
     */
    incrementCountForBetaKeyAndParentKeys: function(betaKey, callback) {
        this.betaKeyManager.incrementCountForBetaKeyAndParentKeys(betaKey, callback);
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} betaKey
     * @param {function(Throwable, BetaKey=} callback
     */
    retrieveBetaKeyByBetaKey: function(requestContext, betaKey, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {BetaKey} */
        var betaKey           = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrieveBetaKeyByBetaKey(betaKey, function(throwable, returnedBetaKey) {
                        if (!throwable) {
                            if (returnedBetaKey) {
                                betaKey = returnedBetaKey;
                                flow.complete(throwable);
                            } else {
                                flow.error(new Exception('NotFound'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyPusher.meldCallWithBetaKey(call.getCallUuid(), betaKey, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyPusher.pushBetaKeyToCall(betaKey, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, betaKey);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {function(Throwable, List.<BetaKey>=} callback
     */
    retrieveAllBetaKeys: function(requestContext, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {List.<BetaKey>} */
        var betaKeyList          = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrieveAllBetaKeys(function(throwable, returnedBetaKeyList) {
                        if (!throwable) {
                            if (returnedBetaKeyList) {
                                betaKeyList = returnedBetaKeyList;
                                flow.complete(throwable);
                            } else {
                                flow.error(new Exception('NotFound'));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyPusher.meldCallWithBetaKeys(call.getCallUuid(), betaKeyList.toArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyPusher.pushBetaKeysToCall(betaKeyList.toArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, betaKeyList);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    /**
     *
     * @param {string} betaKey
     * @param {function(Error, boolean} callback
     */
    validateAndIncrementBaseBetaKey: function(betaKey, callback) {
        this.betaKeyManager.validateAndIncrementBaseBetaKey(betaKey, callback);
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Throwable, List.<BetaKey>=)} callback
     */
    dbRetrieveAllBetaKeys: function(callback) {
        var betaKeys         = null;
        var betaKeyManager   = this.betaKeyManager;
        $task(function(flow) {
            betaKeyManager.retrieveAllBetaKeys(function(throwable, returnedBetaKeys) {
                if (!throwable) {
                    if (returnedBetaKeys) {
                        betaKeys = returnedBetaKeys;
                    } else {
                        throwable = new Exception('NotFound');
                    }
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, betaKeys);
                } else {
                    callback(throwable);
                }
            });
    },

    /**
     * @private
     * @param {string} betaKey
     * @param {function(Throwable, BetaKey=)} callback
     */
    dbRetrieveBetaKeyByBetaKey: function(betaKey, callback) {
        var betaKey          = null;
        var betaKeyManager   = this.betaKeyManager;
        $task(function(flow) {
            betaKeyManager.retrieveBetaKeyByBetaKey(betaKey, function(throwable, returnedBetaKey) {
                if (!throwable) {
                    if (returnedBetaKey) {
                        betaKey = returnedBetaKey;
                    } else {
                        throwable = new Exception('NotFound');
                    }
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, betaKey);
                } else {
                    callback(throwable);
                }
            });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyService).with(
    module("betaKeyService")
        .args([
            arg().ref("betaKeyManager"),
            arg().ref("betaKeyPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyService', BetaKeyService);
