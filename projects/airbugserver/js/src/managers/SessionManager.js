//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionManager')

//@Require('Class')
//@Require('airbugserver.Session')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Session                     = bugpack.require('airbugserver.Session');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

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
     * @param {string} sid
     * @param {{*}} values
     * @param {function(Throwable)=} callback
     */
    createOrUpdateSession: function(sid, values, callback) {
        this.dataStore.update({sid: sid}, values, {upsert: true}, function(throwable, numberAffected, raw) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable, Room)} callback
     */
    createSession: function(session, callback) {
        this.create(session, callback);
    },

    /**
     *
     */
    deleteAllSessions: function(callback){
        this.dataStore.remove({}, function (throwable) {
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
     * @param {function(Throwable)=} callback
     */
    removeAllSessions: function(callback) {
        //TODO replace with deleteAllSessions
        this.dataStore.remove({}, function (throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {function(Throwable)=} callback
     */
    removeSessionBySid: function(sid, callback) {
        //TODO replace with deleteSessionBySid
        this.dataStore.remove({sid: sid}, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {function(Throwable, Array.<Session>} callback
     */
    retrieveAllSessions: function(callback) {
        this.datStore.find({}, callback);
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
        this.dataStore.findOne({sid: sid}, callback);
    },

    /**
     * @param {Session} session
     * @param {function(Throwable, Session)} callback
     */
    updateSession: function(session, callback){
        this.update(session, callback);
    },

    /**
     * @param {string} sid
     * @param {{*}} updates //NOTE: Cannot be a Session instance, only generic objects
     * @param {function(Throwable)=} callback
     */
    updateSessionBySid: function(sid, updates, callback) {
        this.dataStore.update({sid: sid}, updates, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SessionManager).with(
    entityManager("Session")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionManager', SessionManager);
