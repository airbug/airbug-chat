//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionManager')

//@Require('Class')
//@Require('airbugserver.EntityManager')
//@Require('airbugserver.Session')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EntityManager       = bugpack.require('airbugserver.EntityManager');
var Session             = bugpack.require('airbugserver.Session');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel   = BugFlow.$parallel;
var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MongoDataStore} mongoDataStore
     */
    _constructor: function(mongoDataStore) {
        this._super("Session", mongoDataStore);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, number)} callback
     */
    countAllSessions: function(callback) {
         this.count({}, function(throwable, count) {
             if (callback) {
                 callback(throwable, count);
             }
         });
    },

    /**
     * @param {Session} session
     * @param {function(Throwable)=} callback
     */
    createOrUpdateSession: function(sid, values, callback) {
        this.update({sid: sid}, values, {upsert: true}, function(throwable, numberAffected, raw) {
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
        session.setCreatedAt(new Date());
        session.setUpdatedAt(new Date());
        this.dataStore.create(session.toObject(), function(throwable, dbSession) {
            if (!throwable) {
                session.setId(dbSession.id);
                callback(undefined, session);
            } else {
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
    generateSession: function(requestContext, data) {
        var session = new Session();
        session.setCreatedAt(data.createdAt);
        session.setData(data.data);
        session.setExpires(data.expires);
        session.setId(data.id);
        session.setSid(data.sid);
        session.setUpdatedAt(data.updatedAt);
        return session;
    },
    
    /**
     * @param {function(Throwable)=} callback
     */
    removeAllSessions: function(callback) {
        this.remove({}, function (throwable) {
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
        this.remove({sid: sid}, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    },

    /**
     * @param {function(Throwable, Array.<Session>} callback
     */
    retrieveAllSessions: function(callback) {
        this.find({}, callback);
    },

    /**
     * @param {string} sid
     * @param {function(Throwable, Session)}
        */
    retrieveSessionBySid: function(sid, callback) {
        this.dataStore.findOne({sid: sid}, callback);
    },
    
    /**
     * @param {string} sid
     * @param {{*}} updates //NOTE: Cannot be a Session instance, only generic objects
     * @param {function(Throwable)=} callback
     */
    updateSessionBySid: function(sid, updates, callback) {
        this.update({sid: sid}, updates, function(throwable) {
            if (callback) {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionManager', SessionManager);
