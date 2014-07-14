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

//@Export('airbugserver.SessionManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Cookie')
//@Require('airbugserver.Session')
//@Require('airbugserver.SessionData')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Map                 = bugpack.require('Map');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var Cookie              = bugpack.require('airbugserver.Cookie');
    var Session             = bugpack.require('airbugserver.Session');
    var SessionData         = bugpack.require('airbugserver.SessionData');
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


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var SessionManager = Class.extend(EntityManager, {

        _name: "airbugserver.SessionManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable, number)} callback
         */
        countAllSessions: function(callback) {
             this.getDataStore().count({}, function(throwable, count) {
                 if (callback) {
                     callback(throwable, count);
                 }
             });
        },

        /**
         * @param {Session} session
         * @param {function(Throwable, Session)=} callback
         */
        createOrUpdateSession: function(session, callback) {
            if (session.getId()) {
                this.updateSession(session, callback);
            } else {
                this.createSession(session, callback);
            }
        },

        /**
         * @param {Session} session
         * @param {(Array.<string> | function(Throwable, Session=))} dependencies
         * @param {function(Throwable, Session)=} callback
         */
        createSession: function(session, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }
            var options         = {};
            this.create(session, options, dependencies, callback);
        },

        /**
         *
         */
        deleteAllSessions: function(callback) {
            this.getDataStore().remove({}, function(throwable) {
                if (callback) {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {Session} session
         * @param {function(Throwable=)} callback
         */
        deleteSession: function(session, callback) {
            this.delete(session, callback);
        },

        /**
         * @param {string} sid
         * @param {function(Throwable=)} callback
         */
        deleteSessionBySid: function(sid, callback) {
            this.getDataStore().remove({sid: sid}, function(throwable) {
                if (!throwable) {
                    callback();
                } else {
                    callback(new Exception("MongoError", {}, "Error occurred in Mongo DB", [throwable]));
                }
            });
        },

        /**
         * @param {{
         *      cookie: (Cookie),
         *      createdAt: Date,
         *      data: (SessionData),
         *      expires: Date,
         *      id: string,
         *      sid: string,
         *      updatedAt: Date,
         *      userId: string
         * }} data
         * @return {Session}
         */
        generateSession: function(data) {
            var session     = new Session(data);
            if (!Class.doesExtend(data.cookie, Cookie)) {
                data.cookie = new Cookie(data.cookie);
            }
            if (!Class.doesExtend(data.data, SessionData)) {
                data.data = new SessionData(data.data);
            }
            this.generate(session);
            return session;
        },

        populateSession: function(session, properties, callback) {
            //TODO
        },

        /**
         * @param {function(Throwable, Array.<Session>)} callback
         */
        retrieveAllSessions: function(callback) {
            var _this = this;
            this.getDataStore().find({}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newMap = new Map();
                    dbObjects.forEach(function(dbObject) {
                        var entityObject = _this.convertDbObjectToEntity(dbObject);
                        entityObject.commitDelta();
                        newMap.put(entityObject.getId(), entityObject);
                    });
                    callback(undefined, newMap);
                } else {
                    callback(throwable, null);
                }
            });
        },

        /**
         * @param {string} sessionId
         * @param {function(Throwable, Session)} callback
         */
        retrieveSession: function(sessionId, callback) {
            this.retrieve(sessionId, callback);
        },

        /**
         * @param {Array.<string>} sessionIds
         * @param {function(Throwable, Map.<string, Session>)} callback
         */
        retrieveSessions: function(sessionIds, callback) {
            this.retrieveEach(sessionIds, callback);
        },

        /**
         * @param {string} sid
         * @param {function(Throwable, Session=)} callback
         */
        retrieveSessionBySid: function(sid, callback) {
            var _this = this;
            this.getDataStore().findOne({sid: sid}).lean(true).exec(function(throwable, dbObject) {
                if (!throwable) {
                    var entityObject = null;
                    if (dbObject) {
                        entityObject = _this.convertDbObjectToEntity(dbObject);
                        entityObject.commitDelta();
                    }
                    callback(undefined, entityObject);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {function(Throwable, Set.<Session>=)} callback
         */
        retrieveSessionsByUserId: function(userId, callback) {
            var _this = this;
            this.getDataStore().find({userId: userId}).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var newSet = new Set();
                    dbObjects.forEach(function(dbObject) {
                        var session = _this.convertDbObjectToEntity(dbObject);
                        session.commitDelta();
                        newSet.add(session);
                    });
                    callback(null, newSet);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {Session} session
         * @param {function(Throwable, Session=)} callback
         */
        updateSession: function(session, callback) {
            this.update(session, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SessionManager).with(
        entityManager("sessionManager")
            .ofType("Session")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.SessionManager', SessionManager);
});
