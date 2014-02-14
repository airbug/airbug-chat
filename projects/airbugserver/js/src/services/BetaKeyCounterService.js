//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyCounterService')
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

var BetaKeyCounterService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(betaKeyCounterManager, betaKeyCounterPusher) {

        this._super();

        /**
         * @private
         * @type {BetaKeyCounterManager}
         */
        this.betaKeyCounterManager = betaKeyCounterManager;

        /**
         * @private
         * @type {BetaKeyCounterPusher}
         */
        this.betaKeyCounterPusher = betaKeyCounterPusher;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------


    /*
     * @param {RequestContext} requestContext
     * @param {string} betaKey
     * @param {function(Throwable, BetaKeyCounter=} callback
     */
    retrieveBetaKeyCounterByBetaKey: function(requestContext, betaKey, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {BetaKeyCounter} */
        var betaKeyCounter           = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrieveBetaKeyCounterByBetaKey(betaKey, function(throwable, returnedBetaKeyCounter) {
                        if (!throwable) {
                            if (returnedBetaKeyCounter) {
                                betaKeyCounter = returnedBetaKeyCounter;
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
                    _this.betaKeyCounterPusher.meldCallWithBetaKeyCounter(call.getCallUuid(), betaKeyCounter, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyCounterPusher.pushBetaKeyCounterToCall(betaKeyCounter, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, betaKeyCounter);
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
     * @param {function(Throwable, List.<BetaKeyCounter>=} callback
     */
    retrieveAllBetaKeyCounters: function(requestContext, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {List.<BetaKeyCounter>} */
        var betaKeyCounterList          = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrieveAllBetaKeyCounters(function(throwable, returnedBetaKeyCounterList) {
                        if (!throwable) {
                            if (returnedBetaKeyCounterList) {
                                betaKeyCounterList = returnedBetaKeyCounterList;
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
                    _this.betaKeyCounterPusher.meldCallWithBetaKeyCounters(call.getCallUuid(), betaKeyCounterList.toArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.betaKeyCounterPusher.pushBetaKeyCountersToCall(betaKeyCounterList.toArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, betaKeyCounterList);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess'));
        }
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Throwable, List.<BetaKeyCounter>=)} callback
     */
    dbRetrieveAllBetaKeyCounters: function(callback) {
        var betaKeyCounters         = null;
        var betaKeyCounterManager   = this.betaKeyCounterManager;
        $task(function(flow) {
            betaKeyCounterManager.retrieveAllBetaKeyCounters(function(throwable, returnedBetaKeyCounters) {
                if (!throwable) {
                    if (returnedBetaKeyCounters) {
                        betaKeyCounters = returnedBetaKeyCounters;
                    } else {
                        throwable = new Exception('NotFound');
                    }
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, betaKeyCounters);
                } else {
                    callback(throwable);
                }
            });
    },

    /**
     * @private
     * @param {string} betaKey
     * @param {function(Throwable, BetaKeyCounter=)} callback
     */
    dbRetrieveBetaKeyCounterByBetaKey: function(betaKey, callback) {
        var betaKeyCounter          = null;
        var betaKeyCounterManager   = this.betaKeyCounterManager;
        $task(function(flow) {
            betaKeyCounterManager.retrieveBetaKeyCounterByBetaKey(betaKey, function(throwable, returnedBetaKeyCounter) {
                if (!throwable) {
                    if (returnedBetaKeyCounter) {
                        betaKeyCounter = returnedBetaKeyCounter;
                    } else {
                        throwable = new Exception('NotFound');
                    }
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, betaKeyCounter);
                } else {
                    callback(throwable);
                }
            });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyCounterService).with(
    module("betaKeyCounterService")
        .args([
            arg().ref("betaKeyCounterManager"),
            arg().ref("betaKeyCounterPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyCounterService', BetaKeyCounterService);
