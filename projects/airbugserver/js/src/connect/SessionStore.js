//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionStore')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionStore = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager = sessionManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} sid
     * @param {function(Error, Session)} callback
     */
    get: function(sid, callback) {
        this.sessionManager.findSessionBySid(sid, function(error, session) {
            if (!error && session) {
                var data = session.data;
                try {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    callback(null, data);
                } catch (error) {
                    callback(error);
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {Object} data
     * @param {function(Error)} callback
     */
    set: function(sid, data, callback) {
        var cookie = data.cookie;
        var expires = new Date(Date.now() + (60 * 60 * 24));
        if (cookie) {
            if (cookie.expires) {
                expires = cookie.expires;
            } else if (cookie.maxAge) {
                expires = new Date(Date.now() + cookie.maxAge);
            }
        }
        var session = {
            sid: sid,
            data: JSON.stringify(data),
            expires: expires
        };
        this.sessionManager.createOrUpdateSession(session.sid, session, callback);
    },

    /**
     * @param {function(Error)} callback
     */
    all: function(callback) {
        this.sessionManager.findAllSessions(callback);
    },

    /**
     * @param {function(Error)} callback
     */
    clear: function(callback) {
        this.sessionManager.removeAllSessions(callback);
    },

    /**
     * @param {string} sid
     * @param {function(Error)} callback
     */
    destroy: function(sid, callback) {
        this.sessionManager.removeSessionBySid(sid, callback);
    },

    /**
     * @param {function(Error, number)} callback
     */
    length: function(callback) {
        this.sessionManager.countAllSessions(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionStore', SessionStore);
