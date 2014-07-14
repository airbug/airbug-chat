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

//@Export('airbugserver.AirbugCallManager')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.AirbugCall')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('Flows')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')
//@Require('Tracer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil                     = bugpack.require('ArgUtil');
    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var AirbugCall                  = bugpack.require('airbugserver.AirbugCall');
    var EntityManager               = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag     = bugpack.require('bugentity.EntityManagerTag');
    var Flows                     = bugpack.require('Flows');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var Tracer                    = bugpack.require('Tracer');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var entityManager               = EntityManagerTag.entityManager;
    var $iterableParallel           = Flows.$iterableParallel;
    var $parallel                   = Flows.$parallel;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;
    var $traceWithError             = Tracer.$traceWithError;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var AirbugCallManager = Class.extend(EntityManager, {

        _name: "airbugserver.AirbugCallManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {AirbugCall} airbugCall
         * @param {(Array.<string> | function(Throwable, AirbugCall=))} dependencies
         * @param {function(Throwable, AirbugCall=)=} callback
         */
        createAirbugCall: function(airbugCall, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(airbugCall, options, dependencies, callback);
        },

        /**
         * @param {AirbugCall} airbugCall
         * @param {function(Throwable=)} callback
         */
        deleteAirbugCall: function(airbugCall, callback) {
            this.delete(airbugCall, callback);
        },

        /**
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        deleteAirbugCallByCallUuid: function(callUuid, callback) {
            this.getDataStore().remove({callUuid: callUuid}, function(throwable) {
                if (!throwable) {
                    callback();
                } else {
                    callback(new Exception("MongoError", {}, "Error occurred in Mongo DB", [throwable]));
                }
            });
        },
        
        /**
         * @param {{
         *      callType: string,
         *      callUuid: string,
         *      createdAt: Date=,
         *      id: string=,
         *      open: boolean=,
         *      sessionId: string,
         *      updatedAt: Date=,
         *      userId: string
         * }} data
         * @return {AirbugCall}
         */
        generateAirbugCall: function(data) {
            var airbugCall  = new AirbugCall(data);
            this.generate(airbugCall);
            return airbugCall;
        },

        /**
         * @param {AirbugCall} airbugCall
         * @param {Array.<string>} properties
         * @param {function(Throwable, AirbugCall=)} callback
         */
        populateAirbugCall: function(airbugCall, properties, callback) {
            var options = {
                session: {
                    idGetter:   airbugCall.getSessionId,
                    getter:     airbugCall.getSession,
                    setter:     airbugCall.setSession
                },
                user: {
                    idGetter:   airbugCall.getUserId,
                    getter:     airbugCall.getUser,
                    setter:     airbugCall.setUser
                }
            };
            this.populate(airbugCall, options, properties, callback);
        },

        /**
         * @param {string} airbugCallId
         * @param {function(Throwable, AirbugCall=)} callback
         */
        retrieveAirbugCall: function(airbugCallId, callback) {
            this.retrieve(airbugCallId, callback);
        },

        /**
         * @param {Array.<string>} airbugCallIds
         * @param {function(Throwable, Map.<string, AirbugCall>=)} callback
         */
        retrieveAirbugCalls: function(airbugCallIds, callback) {
            this.retrieveEach(airbugCallIds, callback);
        },

        /**
         * @param {AirbugCall} airbugCall
         * @param {function(Throwable, AirbugCall=)} callback
         */
        updateAirbugCall: function(airbugCall, callback) {
            this.update(airbugCall, callback);
        },
        
        
        // TODO BRN: Update all below this line.
        
        
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

    bugmeta.tag(AirbugCallManager).with(
        entityManager("airbugCallManager")
            .ofType("AirbugCall")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugCallManager', AirbugCallManager);
});
