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
        this.userManager    = userManager;
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
                                    session.save(function(error, session){
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
                        session.data.userId = user.id;
                        session.save(function(error, user){
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
     *      firstName: string,
     *      lastName: string,
     *      email: string
     * }} user
     * @param {function(Error, User)} callback
     */
    establishUser: function(userObj, callback) {
        //NOTE: This is be called on the initial http request
        var _this = this;
        this.userManager.findOrCreateUser(userObj, function(error, user) {
            if (!error) {
                callback(null, user);
            } else {
                callback(error, user);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {function(error, user)} callback
     */
    findUserById: function(userId, callback){
        this.userManager.findById(userId, callback);
    },

    /**
     * @param {} userObj
     * @param {function(error, user)} callback
     */
    loginUser: function(userObj, callback){
        var conditions = {
            email: userObj.email
        };
        this.userManager.findOne(conditions, callback);
    },

    /**
     * @param {User} currentUser
     * @param {function(error)} callback 
     */
    logoutUser: function(currentUser, callback){
        //TODO
        //For development purposes only:
        callback(null);
    },

    registerUser: function(userObj, callback){
        this.userManager.create(userObj, callback)
    },

    retrieveUser: function(userId, callback){
        this.userManager.findById(userId, function(error, user){
            //TODO make sure to remove any sensitive information
            if(user){
                var user = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
            }
            callback(error, user);
        });
    },

    //NOTE Untested
    retrieveUsers: function(userIds, callback){
        this.userManager.find("id").in(userIds).exec(callback);
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

