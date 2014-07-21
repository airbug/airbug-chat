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

//@Export('airbugserver.InteractionStatusManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var Flows                     = bugpack.require('Flows');
    var Obj                         = bugpack.require('Obj');
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var ModuleTag            = bugpack.require('bugioc.ModuleTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var module                      = ModuleTag.module;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var InteractionStatusManager = Class.extend(Obj, {

        _name: "airbugserver.InteractionStatusManager",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AirbugCallManager} airbugCallManager
         * @param {RedisClient} redisClient
         */
        _constructor: function(airbugCallManager, redisClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugCallManager}
             */
            this.airbugCallManager      = airbugCallManager;

            /**
             * @private
             * @type {RedisClient}
             */
            this.redisClient            = redisClient;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugCallManager}
         */
        getAirbugCallManager: function() {
            return this.airbugCallManager;
        },

        /**
         * @return {RedisClient}
         */
        getRedisClient: function() {
            return this.redisClient;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} userId
         * @param {function(Throwable, boolean=)} callback
         */
        doesUserHaveInteractionStatus: function(userId, callback) {
            var _this               = this;
            var hasStatus           = false;
            var userStatusHashKey   = this.generateUserStatusHashKey(userId);
            $task(function(flow) {
                _this.redisClient.exists(userStatusHashKey, function(error, reply) {
                    if (!error) {
                        hasStatus = !!reply;
                        flow.complete();
                    } else {
                        flow.error(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                    }
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, hasStatus);
                } else {
                    callback(throwable);
                }
            })
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, Array.<string>=)} callback
         */
        getAllInteractionStatusesForUserId: function(userId, callback) {
            var _this               = this;
            var userStatusHashKey   = this.generateUserStatusHashKey(userId);
            var statusValues        = null;
            $task(function(flow) {
                _this.redisClient.hVals(userStatusHashKey, function(errors, replies) {
                    if (!errors) {
                        statusValues = replies;
                        flow.complete();
                    } else {
                        flow.error(new Exception("RedisError", {}, "An error occurred in the redis db", errors));
                    }
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, statusValues);
                } else {
                    callback(throwable);
                }
            })
        },

        /**
         * @param {string} callUuid
         * @param {function(Throwable, string=)} callback
         */
        getInteractionStatusForCallUuid: function(callUuid, callback) {
            var _this       = this;
            var status      = null;
            var userId      = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.retrieveAirbugCallByCallUuid(callUuid, function(throwable, airbugCall) {
                        if (!throwable) {
                            if (airbugCall) {
                                userId = airbugCall.getUserId();
                            } else {
                                throwable = new Exception("NotFound", {}, "Could not find AirbugCall for callUuid '" + callUuid + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbGetInteractionStatus(userId, callUuid, function(throwable, returnedStatus) {
                        if (!throwable) {
                            status = returnedStatus;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, status);
                } else {
                    if (Class.doesExtend(throwable, Exception) && throwable.getType() === "NotFound") {
                        callback(null, null)
                    } else {
                        callback(throwable);
                    }
                }
            });
        },

        /**
         * @param {string} callUuid
         * @param {function(Throwable, boolean=)} callback
         */
        hasInteractionStatusForCallUuid: function(callUuid, callback) {
            var _this       = this;
            var exists      = null;
            var userId      = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.retrieveAirbugCallByCallUuid(callUuid, function(throwable, airbugCall) {
                        if (!throwable) {
                            if (airbugCall) {
                                userId = airbugCall.getUserId();
                            } else {
                                throwable = new Exception("NotFound", {}, "Could not find AirbugCall for callUuid '" + callUuid + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbHasInteractionStatus(userId, callUuid, function(throwable, returnedExists) {
                        if (!throwable) {
                            exists = returnedExists;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, exists);
                    } else {
                        if (Class.doesExtend(throwable, Exception) && throwable.getType() === "NotFound") {
                            callback(null, false)
                        } else {
                            callback(throwable);
                        }
                    }
            });
        },

        /**
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        removeInteractionStatusForCallUuid: function(callUuid, callback) {
            var _this       = this;
            var userId      = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.retrieveAirbugCallByCallUuid(callUuid, function(throwable, airbugCall) {
                        if (!throwable) {
                            if (airbugCall) {
                                userId = airbugCall.getUserId();
                            } else {
                                throwable = new Exception("NotFound", {}, "Could not find AirbugCall for callUuid '" + callUuid + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbRemoveInteractionStatus(userId, callUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback();
                } else {
                    if (Class.doesExtend(throwable, Exception) && throwable.getType() === "NotFound") {
                        callback()
                    } else {
                        callback(throwable);
                    }
                }
            });
        },

        /**
         * @param {string} callUuid
         * @param {string} status
         * @param {function(Throwable=)} callback
         */
        setInteractionStatusForCallUuid: function(callUuid, status, callback) {
            var _this       = this;
            var userId      = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.retrieveAirbugCallByCallUuid(callUuid, function(throwable, airbugCall) {
                        if (!throwable) {
                            if (airbugCall) {
                                userId = airbugCall.getUserId();
                            } else {
                                throwable = new Exception("NotFound", {}, "Could not find AirbugCall for callUuid '" + callUuid + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbSetInteractionStatus(userId, callUuid, status, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback();
                } else {
                    if (Class.doesExtend(throwable, Exception) && throwable.getType() === "NotFound") {
                        callback()
                    } else {
                        callback(throwable);
                    }
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} userId
         * @param {string} callUuid
         * @param {function(Throwable, string=)} callback
         */
        dbGetInteractionStatus: function(userId, callUuid, callback) {
            var userStatusHashKey = this.generateUserStatusHashKey(userId);
            this.redisClient.hGet(userStatusHashKey, callUuid, function(error, reply) {
                if (!error) {
                    callback(null, reply);
                } else {
                    callback(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                }
            });
        },

        /**
         * @private
         * @param {string} userId
         * @param {string} callUuid
         * @param {function(Throwable, boolean=)} callback
         */
        dbHasInteractionStatus: function(userId, callUuid, callback) {
            var userStatusHashKey = this.generateUserStatusHashKey(userId);
            this.redisClient.hExists(userStatusHashKey, callUuid, function(error, reply) {
                if (!error) {
                    callback(null, !!reply);
                } else {
                    callback(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                }
            });
        },

        /**
         * @private
         * @param {string} userId
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        dbRemoveInteractionStatus: function(userId, callUuid, callback) {
            var _this               = this;
            var userStatusHashKey   = this.generateUserStatusHashKey(userId);
            var isEmpty             = false;
            $series([
                $task(function(flow) {
                    _this.redisClient.hDel(userStatusHashKey, callUuid, function(error) {
                        if (!error) {
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                        }
                    });
                }),
                $task(function(flow) {
                    _this.redisClient.hLen(userStatusHashKey, function(error, reply) {
                        if (!error) {
                            if (reply === 0) {
                                isEmpty = true;
                            }
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                        }
                    });
                }),
                $task(function(flow) {
                    if (isEmpty) {
                        _this.redisClient.del(userStatusHashKey, function(error) {
                            if (!error) {
                                flow.complete();
                            } else {
                                flow.error(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                            }
                        });
                    } else {
                        flow.complete();
                    }
                })
            ]).execute(callback);
        },

        /**
         * @private
         * @param {string} userId
         * @param {string} callUuid
         * @param {string} status
         * @param {function(Throwable=)} callback
         */
        dbSetInteractionStatus: function(userId, callUuid, status, callback) {
            var userStatusHashKey = this.generateUserStatusHashKey(userId);
            this.redisClient.hSet(userStatusHashKey, callUuid, status, function(error, reply) {
                if (!error) {
                    callback();
                } else {
                    callback(new Exception("RedisError", {}, "An error occurred in the redis db", [error]));
                }
            });
        },

        /**
         * @private
         * @param {string} userId
         * @returns {string}
         */
        generateUserStatusHashKey: function(userId) {
            return "userStatus:" + userId;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(InteractionStatusManager).with(
        module("interactionStatusManager")
            .args([
                arg().ref("airbugCallManager"),
                arg().ref("redisClient")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.InteractionStatusManager', InteractionStatusManager);
});
