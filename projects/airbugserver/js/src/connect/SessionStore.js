//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionStore')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var connect     = require('connect');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionStore = Class.adapt(connect.session.Store, {


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
     * @param {function(Throwable, Session)} callback
     */
    get: function(sid, callback) {

        //TEST
        console.log("SessionStore.get - sid:" + sid);

        var _this = this;
        this.sessionManager.retrieveSessionBySid(sid, function(throwable, session) {
            if (!throwable) {
                if (session) {
                    var data = session.getData();
                    try {
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }
                        var expires = TypeUtil.isString(session.getExpires())
                            ? new Date(session.getExpires())
                            : session.getExpires();
                        if (!expires || new Date < expires) {
                            console.log("data:", data);
                            callback(undefined, data); // or session //clear cookies and retry
                        } else {
                            _this.destroy(sid, callback);
                        }
                    } catch (throwable) {
                        callback(throwable);
                    }
                } else {
                    callback();
                }
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} sid
     * @param {Object} data
     * @param {function(Throwable)} callback
     */
    set: function(sid, data, callback) {
        var _this = this;

        //TEST
        console.log("SessionStore.set - sid:" + sid + " data:" + data.toString());

        var cookie = data.cookie;
        var expires = new Date(Date.now() + (60 * 60 * 24));
        if (cookie) {
            if (cookie.expires) {
                expires = cookie.expires;
            } else if (cookie.maxAge) {
                expires = new Date(Date.now() + cookie.maxAge);
            }
        }
        console.log("cookie:", cookie);

        this.sessionManager.retrieveSessionBySid(sid, function(throwable, session) {
            if (!throwable) {
                if (session) {
                    session.setData(data);
                    session.setExpires(expires);
                    _this.sessionManager.updateSession(session, callback);
                } else {
                    session = _this.sessionManager.generateSession({
                        sid: sid,
                        data: data,
                        expires: expires
                    });
                    _this.sessionManager.createSession(session, callback);
                }
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {function(Throwable)} callback
     */
    all: function(callback) {
        this.sessionManager.retrieveAllSessions(function(throwable, sessionMap) {
            if (!throwable) {
                callback(undefined, sessionMap.getValueArray());
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {function(Throwable)} callback
     */
    clear: function(callback) {
        this.sessionManager.deleteAllSessions(callback);
    },

    /**
     * @param {string} sid
     * @param {function(Throwable)} callback
     */
    destroy: function(sid, callback) {
        this.sessionManager.deleteSessionBySid(sid, callback);
    },

    /**
     * @param {function(Throwable, number)} callback
     */
    length: function(callback) {
        this.sessionManager.countAllSessions(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionStore', SessionStore);
