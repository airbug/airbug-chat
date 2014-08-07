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
//@Require('Collections')
//@Require('Exception')
//@Require('Flows')
//@Require('Tracer')
//@Require('TypeUtil')
//@Require('airbugserver.AirbugCall')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Collections         = bugpack.require('Collections');
    var Exception           = bugpack.require('Exception');
    var Flows               = bugpack.require('Flows');
    var Tracer              = bugpack.require('Tracer');
    var TypeUtil            = bugpack.require('TypeUtil');
    var AirbugCall          = bugpack.require('airbugserver.AirbugCall');
    var EntityManager       = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag    = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var entityManager       = EntityManagerTag.entityManager;
    var $iterableParallel   = Flows.$iterableParallel;
    var $parallel           = Flows.$parallel;
    var $series             = Flows.$series;
    var $task               = Flows.$task;
    var $traceWithError     = Tracer.$traceWithError;


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
         * @param {string} userId
         * @param {function(Throwable, List.<AirbugCall>=)} callback
         */
        retrieveOpenAirbugCallsByUserId: function(userId, callback) {
            var _this = this;
            this.getDataStore().find({userId: userId, open: true}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = Collections.list();
                    dbObjects.forEach(function(dbObject) {
                        var airbugCall = _this.convertDbObjectToEntity(dbObject);
                        airbugCall.commitDelta();
                        newList.add(airbugCall);
                    });
                    callback(null, newList);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} airbugCallId
         * @param {function(Throwable, AirbugCall=)} callback
         */
        retrieveAirbugCall: function(airbugCallId, callback) {
            this.retrieve(airbugCallId, callback);
        },

        /**
         * @param {string} callUuid
         * @param {function(Throwable, AirbugCall=)} callback
         */
        retrieveAirbugCallByCallUuid: function(callUuid, callback) {
            var _this = this;
            this.getDataStore().findOne({callUuid: callUuid}).lean(true).exec(function(throwable, dbObject) {
                if (!throwable) {
                    var airbugCall = null;
                    if (dbObject) {
                        airbugCall = _this.convertDbObjectToEntity(dbObject);
                        airbugCall.commitDelta();
                    }
                    callback(null, airbugCall);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {Array.<string>} airbugCallIds
         * @param {function(Throwable, Map.<string, AirbugCall>=)} callback
         */
        retrieveAirbugCalls: function(airbugCallIds, callback) {
            this.retrieveEach(airbugCallIds, callback);
        },

        /**
         * @param {string} sessionId
         * @param {function(Throwable, List.<AirbugCall>=)} callback
         */
        retrieveAirbugCallsBySessionId: function(sessionId, callback) {
            var _this = this;
            this.getDataStore().find({sessionId: sessionId}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = Collections.list();
                    dbObjects.forEach(function(dbObject) {
                        var airbugCall = _this.convertDbObjectToEntity(dbObject);
                        airbugCall.commitDelta();
                        newList.add(airbugCall);
                    });
                    callback(null, newList);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, List.<AirbugCall>=)} callback
         */
        retrieveAirbugCallsByUserId: function(userId, callback) {
            var _this = this;
            this.getDataStore().find({userId: userId}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newList = Collections.list();
                    dbObjects.forEach(function(dbObject) {
                        var airbugCall = _this.convertDbObjectToEntity(dbObject);
                        airbugCall.commitDelta();
                        newList.add(airbugCall);
                    });
                    callback(null, newList);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {AirbugCall} airbugCall
         * @param {function(Throwable, AirbugCall=)} callback
         */
        updateAirbugCall: function(airbugCall, callback) {
            this.update(airbugCall, callback);
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
