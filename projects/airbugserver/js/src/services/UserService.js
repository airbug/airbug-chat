//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Obj')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var IHand   = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager, userManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager = sessionManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager = userManager;
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {} handshakeData
     * @param {function(Error, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {

        //TODO BRN (QUESTION): When a session is regenerated, does it automatically rerun the authorization (handshake.shakeIt) call

        var _this = this;
        if (handshakeData.session) {
            var session = handshakeData.session;
            if (session.userId) {
                this.userManager.findUserById(session.data.userId, function(error, user) {
                    if (!error) {
                        if (user) {
                            handshakeData.user = user;
                        } else {
                            delete session.data.userId;
                            _this.createAnonymousUser(function(error, user) {
                                if (!error) {
                                    handshakeData.user = user;
                                    session.data.userId = user.id;
                                    _this.sessionManager.updateSessionBySid(session.sid, session, function(error) {
                                        callback(error);
                                    });
                                } else {
                                    callback(error);
                                }
                            });
                        }
                    } else {
                        callback(error);
                    }
                });
            } else {
                this.createAnonymousUser(function(error, user) {
                    if (!error) {
                        handshakeData.user = user;
                        session.userId = user.id;
                        _this.sessionManager.updateSessionBySid(session.sid, session, function(error) {
                            callback(error);
                        });
                    } else {
                        callback(error);
                    }
                });
            }
        } else {
            callback(new Error('No session has been generated.'), false);
        }
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error, User)} callback
     */
    createAnonymousUser: function(callback) {
        var user = {anonymous: true};
        this.userManager.createUser(user, callback);
    },

    /**
     * @param {{
     *      name: string,
     *      email: string
     * }} user
     * @param {function(Error, User)} callback
     */
    establishUser: function(user, callback) {
        var _this = this;
        this.userManager.findOrCreate(user, function(error, user) {
            if (!error) {
                callback(null, user);
            } else {
                callback(error, user);
            }
        });
    },

    /**
     * @param {User} currentUser
     * @param {function(error)} callback 
     */
    logoutUser: function(currentUser, callback){
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserService, IHand);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);

