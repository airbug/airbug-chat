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

var bugpack = require('bugpack').context();


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
        console.log("UserService#shakeIt");
        var _this = this;
        if (handshakeData.session) {
            var session = handshakeData.session;
            console.log("session:", session);
            if (session.data.userId) {
                this.userManager.findUserById(session.data.userId, function(error, user) {
                    console.log("userManager.findUserById. user:", user);
                    if (!error) {
                        if (user) {
                            handshakeData.user = user;
                            callback(error);
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
        var user = this.userManager.generateUser({
            anonymous: true
        });
        this.userManager.createUser(user, callback);
    },

    /**
     * @param {string} email
     * @param {function(Error, User)} callback
     */
    findUserByEmail: function(email, callback){
        this.userManager.findOne({email: email}, callback);
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
     * @param {{*}} userObj
     * @param {function(error, User)} callback
     */
    registerUser: function(userObj, callback){
        var _this = this;
        this.userManager.findOne({email: userObj.email}, function(error, user){
            //TODO what errors exist for this?
            if(!error){
                if(!user){
                    _this.userManager.create(userObj, callback);
                } else {
                    callback(new Error("User already exists"), null);
                }
            } else {
                callback(error, null);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {function(error, *)} callback
     */
    retrieveUser: function(userId, callback){
        //TODO BRN: What does this select() call do here?
        this.userManager.findById(userId).select("_id firstName lastName").exec(callback);
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(error, {*})} callback 
     */
    retrieveUsers: function(userIds, callback) {
        this.userManager.where("_id").in(userIds).select("_id firstName lastName").exec(callback);
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
