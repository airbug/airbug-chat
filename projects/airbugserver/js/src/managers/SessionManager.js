//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionManager')

//@Require('Class')
//@Require('mongo.MongoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var MongoManager  = bugpack.require('mongo.MongoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionManager = Class.extend(MongoManager, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error, number)} callback
     */
    countAllSessions: function(callback) {
         this.count({}, function(error, count) {
             if (callback) {
                 callback(error, count);
             }
         });
    },

    /**
     * @param {string} sid
     * @param {Session} session
     * @param {function(Error)=} callback
     */
    createOrUpdateSession: function(sid, session, callback) {
        this.update({sid: sid}, session, {upsert: true}, function(error, numberAffected, raw) {
            if (callback) {
                callback(error);
            }
        });
    },

    /**
     * @param {Object} session
     * @param {function(Error, Session)=} callback
     */
    createSession: function(session, callback) {
        this.create(session, function(error, session) {
            if (callback) {
                callback(error, session);
            }
        });
    },

    /**
     * @param {function(Error, Array.<Session>} callback
     */
    findAllSessions: function(callback) {
        this.find({}, callback);
    },

    /**
     * @param {string} sid
     * @param {function(Error, Session)}
     */
    findSessionBySid: function(sid, callback) {
        this.findOne({sid: sid}, callback);
    },

    /**
     * @param {function(Error)=} callback
     */
    removeAllSessions: function(callback) {
        this.remove({}, function (error) {
            if (callback) {
                callback(error);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {function(Error)=} callback
     */
    removeSessionBySid: function(sid, callback) {
        this.remove({sid: sid}, function(error) {
            if (callback) {
                callback(error);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {{*}} updates //NOTE: Cannot be a Session instance, only generic objects
     * @param {function(Error)=} callback
     */
    updateSessionBySid: function(sid, updates, callback) {
        this.update({sid: sid}, updates, function(error) {
            if (callback) {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionManager', SessionManager);
