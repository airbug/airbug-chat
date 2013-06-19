//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionManager')

//@Require('Class')
//@Require('airbugserver.BugManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var BugManager  = bugpack.require('airbugserver.BugManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionManager = Class.extend(BugManager, {

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
        //TEST
        console.log("createOrUpdateSession - sid:", sid, " session:", session , " callback:", callback);

        this.update({sid: sid}, session, {upsert: true}, function(error, numberAffected, raw) {

            //TEST
            console.log("createOrUpdateSession callback - error:", error, " numberAffected:", numberAffected, " raw:", raw);

            if (callback) {
                //TEST
                console.log("createOrUpdateSession callback about to fire");
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
     * @param {Session} session
     * @param {function(Error)=} callback
     */
    updateSessionBySid: function(sid, session, callback) {
        this.update({sid: sid}, session, function(error) {
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
