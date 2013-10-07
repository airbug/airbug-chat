//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var IHand               = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;
var $iterableParallel   = BugFlow.$iterableParallel;


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
                this.userManager.retrieveUser(session.data.userId, function(throwable, user) {
                    console.log("userManager.findUserById. user:", user);
                    if (!throwable) {
                        if (user) {
                            handshakeData.user = user;
                            callback(throwable);
                        } else {
                            delete session.data.userId;
                            _this.createAnonymousUser(function(throwable, user) {
                                if (!throwable) {
                                    handshakeData.user = user;
                                    session.data.userId = user.id;
                                    session.save(function(throwable, session){
                                        callback(throwable);
                                    });
                                } else {
                                    callback(throwable);
                                }
                            });
                        }
                    } else {
                        callback(throwable);
                    }
                });
            } else {
                this.createAnonymousUser(function(throwable, user) {
                    if (!throwable) {
                        handshakeData.user = user;
                        session.data.userId = user.id;
                        session.save(function(throwable, user){
                            callback(throwable);
                        });
                    } else {
                        callback(throwable);
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
     * @param {} userObject
     * @param {function(Throwable, User)} callback
     */
    loginUser: function(userObject, callback){
        var conditions = {
            email: userObject.email
        };
        this.userManager.findOne(conditions, callback);
    },

    /**
     * @param {{*}} userObject
     * @param {function(throwable, User)} callback
     */
    registerUser: function(userObject, callback) {
        var _this = this;
        this.userManager.findOne({email: userObject.email}, function(throwable, user) {
            //TODO what throwables exist for this?
            if (!throwable) {
                if (!user) {
                    _this.userManager.create(userObject, callback);
                } else {
                    callback(new Error("User already exists"));
                }
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {RequestContext} requestContext
     * @param {function(callback
     */
    retrieveCurrentUser: function(requestContext, callback) {
        //TODO BRN:
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, *)} callback
     */
    retrieveUser: function(userId, callback){
        this.userManager.retrieveUser(userId, callback);
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(Throwable, {*})} callback
     */
    retrieveUsers: function(userIds, callback) {
        this.userManager.retrieveUsers(userIds, callback);
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
