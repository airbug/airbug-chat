//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AirbugCallManager')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                 = bugpack.require('ArgUtil');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var TypeUtil                = bugpack.require('TypeUtil');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var BugTrace                = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $iterableParallel       = BugFlow.$iterableParallel;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $traceWithError         = BugTrace.$traceWithError;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugCallManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} redisClient
     */
    _constructor: function(redisClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RedisClient}
         */
        this.redisClient        = redisClient;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
     * @param {string} callUuid
     * @param {string} sessionId
     * @param {string} userId
     * @param {function(Throwable=)} callback
     */
    createAirbugCall: function(callUuid, sessionId, userId, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "callUuid", optional: false, type: "string"},
            {name: "sessionId", optional: false, type: "string"},
            {name: "userId", optional: false, type: "string"},
            {name: "callback", optional: false, type: "function"}
        ]);
        callUuid    = args.callUuid;
        sessionId   = args.sessionId;
        userId      = args.userId;
        var multi = this.redisClient.multi();
        multi
            .sadd(this.generateCallUuidSetForSessionIdKey(sessionId), callUuid)
            .sadd(this.generateSessionIdSetForUserIdKey(userId), sessionId)
            .set(this.generateAirbugCallKey(callUuid), JSON.stringify({
                sessionId: sessionId,
                userId: userId
            }))
            .exec($traceWithError(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(new Exception("RedisError", {}, "Errors occurred in the Redis Database", errors));
                }
            }));
    },

    /**
     * @param {string} sessionId
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getCallUuidSetForSessionId: function(sessionId, callback) {
        var callUuidSetKey = this.generateCallUuidSetForSessionIdKey(sessionId);
        this.redisClient.sMembers(callUuidSetKey, $traceWithError(function(error, replies) {
            if (!error) {

                /** @type {Set.<string>} */
                var callUuidSet = new Set(replies);
                callback(null, callUuidSet);
            } else {
                callback(error)
            }
        }));
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getCallUuidSetForUserId: function(userId, callback) {
        var _this           = this;
        var sessionIdSet    = null;
        var callUuidSet     = new Set();
        $series([
            $task(function(flow) {
                _this.getSessionIdSetForUserId(userId, function(throwable, returnedSessionIdSet) {
                    if (!throwable) {
                        sessionIdSet = returnedSessionIdSet;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                $iterableParallel(sessionIdSet, function(flow, sessionId) {
                    _this.getCallUuidSetForSessionId(sessionId, function(throwable, returnedCallUuidSet) {
                        if (!throwable) {
                            callUuidSet.addAll(returnedCallUuidSet);
                        }
                        flow.complete(throwable);
                    });
                }).execute(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, callUuidSet);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable, string=)} callback
     */
    getSessionIdForCallUuid: function(callUuid, callback) {
        var airbugCallKey   = this.generateAirbugCallKey(callUuid);
        this.redisClient.get(airbugCallKey, $traceWithError(function(error, reply) {
            if (!error) {
                var airbugCall = JSON.parse(reply);
                callback(null, airbugCall.sessionId);
            } else {
                callback(error);
            }
        }));
    },

    /**
     *
     * @param {string} userId
     * @param {function(Throwable, Set.<string>)} callback
     */
    getSessionIdSetForUserId: function(userId, callback) {
        var sessionIdSetKey = this.generateSessionIdSetForUserIdKey(userId);
        this.redisClient.sMembers(sessionIdSetKey, $traceWithError(function(error, replies) {
            if (!error) {

                /** @type {Set.<string>} */
                var sessionIdSet = new Set(replies);
                callback(null, sessionIdSet);
            } else {
                callback(error);
            }
        }));
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable, string=)} callback
     */
    getUserIdForCallUuid: function(callUuid, callback) {
        var airbugCallKey   = this.generateAirbugCallKey(callUuid);
        this.redisClient.get(airbugCallKey, $traceWithError(function(error, reply) {
            if (!error) {
                if (reply) {
                    var airbugCall = JSON.parse(reply);
                    callback(null, airbugCall.userId);
                } else {
                    callback(null, null);
                }
            } else {
                callback(error);
            }
        }));
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    removeAirbugCallForCallUuid: function(callUuid, callback) {
        var _this           = this;
        var sessionId       = null;
        var userId          = null;
        var sessionCount    = null;
        $series([
            $parallel([
                $task(function(flow) {
                    _this.getSessionIdForCallUuid(callUuid, function(throwable, returnedSessionId) {
                        if (!throwable) {
                            sessionId = returnedSessionId;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.getUserIdForCallUuid(callUuid, function(throwable, returnedUserId) {
                        if (!throwable) {
                            userId = returnedUserId;
                        }
                        flow.complete(throwable);
                    });
                })
            ]),
            $task(function(flow) {
                var multi = _this.redisClient.multi();
                multi
                    .srem(_this.generateCallUuidSetForSessionIdKey(sessionId), callUuid)
                    .del(_this.generateAirbugCallKey(callUuid))
                    .exec(function(errors, replies) {
                        if (!errors) {
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "Error occurred in Redis", errors));
                        }
                    });
            }),
            $task(function(flow) {
                _this.redisClient.sCard(_this.generateCallUuidSetForSessionIdKey(sessionId), $traceWithError(function(error, reply) {
                    if (!error) {
                        sessionCount = reply;
                        flow.complete();
                    } else {
                        flow.error(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
                    }
                }));
                _this.generateCallUuidSetForSessionIdKey(sessionId)
            }),
            $task(function(flow) {
                if (sessionCount === 0) {
                    _this.sRem(_this.generateSessionIdSetForUserIdKey(userId), sessionId, $traceWithError(function(error, reply) {
                        if (!error) {
                            flow.complete();
                        } else {
                            flow.error(new Exception("RedisError", {}, "Error occurred in Redis", [error]));
                        }
                    }));
                } else {
                    flow.complete();
                }
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @return {string}
     */
    generateAirbugCallKey: function(callUuid) {
        return "airbugCall:" + callUuid;
    },

    /**
     * @private
     * @param {string} sessionId
     * @return {string}
     */
    generateCallUuidSetForSessionIdKey: function(sessionId) {
        return "callUuidSetForSessionId:" + sessionId;
    },

    /**
     * @private
     * @param {string} userId
     * @return {string}
     */
    generateSessionIdSetForUserIdKey : function(userId) {
        return "sessionIdSetForUserId:" + userId;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugCallManager).with(
    module("airbugCallManager")
        .args([
            arg().ref("redisClient")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AirbugCallManager', AirbugCallManager);
