//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionManager')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Set')
//@Require('airbugserver.Session')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Map                         = bugpack.require('Map');
var Set                         = bugpack.require('Set');
var Session                     = bugpack.require('airbugserver.Session');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionManager = Class.extend(EntityManager, {


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, number)} callback
     */
    countAllSessions: function(callback) {
         this.dataStore.count({}, function(throwable, count) {
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
     * @param {function(Throwable, Session)} callback
     */
    createSession: function(session, callback) {
        this.create(session, callback);
    },

    /**
     *
     */
    deleteAllSessions: function(callback) {
        this.dataStore.remove({}, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable)} 
     */
    deleteSession: function(session, callback){
        this.delete(session, callback);
    },

    /**
     *
     */
    deleteSessionBySid: function(sid, callback){
        this.dataStore.remove({sid: sid}, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      data: Object,
     *      expires: Date,
     *      id: string,
     *      sid: string,
     *      updatedAt: Date
     * }} data
     * @return {Session}
     */
    generateSession: function(data) {
        return new Session(data);
    },

    populateSession: function(session, properties, callback){
        //TODO
    },

    /**
     * @param {function(Throwable, Array.<Session>} callback
     */
    retrieveAllSessions: function(callback) {
        var _this = this;
        this.datStore.find({}).lean(true).exec(function(throwable, results) {
            if (!throwable) {
                var newMap = new Map();
                results.forEach(function(result) {
                    var entityObject = _this["generate" + _this.entityType](result);
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
     * @param {Array.<string>} sessionId
     * @param {function(Throwable, Session)} callback
     */
    retrieveSession: function(sessionId, callback){
        this.retrieve(sessionId, callback);
    },

    /**
     * @param {string} sessionIds
     * @param {function(Throwable, Map.<string, Session>)} callback
     */
    retrieveSessions: function(sessionIds, callback){
        this.retrieveEach(sessionIds, callback);
    },

    /**
     * @param {string} sid
     * @param {function(Throwable, Session)}
     */
    retrieveSessionBySid: function(sid, callback) {
        var _this = this;
        this.dataStore.findOne({sid: sid}).lean(true).exec(function(throwable, dbJson) {
            if (!throwable) {
                var entityObject = null;
                if (dbJson) {
                    entityObject = _this["generate" + _this.entityType](dbJson);
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
     * @param {function(Throwable, Set.<Session>)}
     */
    retrieveSessionsByUserId: function(userId, callback) {
        var _this = this;
        this.dataStore.find(userId: userId).lean(true).exec(function(throwable, results) {
            if (!throwable) {
                var newSet = new Set();
                results.forEach(function(result) {
                    var newSession = _this.generateSession(result);
                    newSession.commitDelta();
                    newSet.add(newSession);
                }
                callback(undefined, newSet);
            } else {
                callback(throwable, undefined)
            }
        });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable, Session)} callback
     */
    updateSession: function(session, callback){
        this.update(session, callback);
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SessionManager).with(
    entityManager("sessionManager")
        .ofType("Session")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionManager', SessionManager);
