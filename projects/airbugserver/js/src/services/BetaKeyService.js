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

//@Export('airbugserver.BetaKeyService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Obj                     = bugpack.require('Obj');
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
    var $series                 = BugFlow.$series;
    var $task                   = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BetaKeyService = Class.extend(Obj, {

        _name: "airbugserver.BetaKeyService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {BetaKeyManager} betaKeyManager
         * @param {BetaKeyPusher} betaKeyPusher
         */
        _constructor: function(logger, betaKeyManager, betaKeyPusher) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BetaKeyManager}
             */
            this.betaKeyManager     = betaKeyManager;

            /**
             * @private
             * @type {BetaKeyPusher}
             */
            this.betaKeyPusher      = betaKeyPusher;

            /**
             * @private
             * @type {Logger}
             */
            this.logger             = logger;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BetaKeyManager}
         */
        getBetaKeyManager: function() {
            return this.betaKeyManager;
        },

        /**
         * @return {BetaKeyPusher}
         */
        getBetaKeyPusher: function() {
            return this.betaKeyPusher;
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
         * @param {string} betaKey
         * @param {function(?Error)} callback
         */
        incrementCountForBetaKeyAndParentKeys: function(betaKey, callback) {
            this.betaKeyManager.incrementCountForBetaKeyAndParentKeys(betaKey, callback);
        },

        /**
         * @param {RequestContext} requestContext
         * @param {string} betaKey
         * @param {function(Throwable, BetaKey=)} callback
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

        /**
         * @param {RequestContext} requestContext
         * @param {function(Throwable, List.<BetaKey>=)} callback
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
         * @param {string} betaKey
         * @param {function(Throwable, boolean=)} callback
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
                arg().ref("logger"),
                arg().ref("betaKeyManager"),
                arg().ref("betaKeyPusher")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.BetaKeyService', BetaKeyService);
});
