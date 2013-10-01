//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.User')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var Set         = bugpack.require('Set');
var User        = bugpack.require('airbugserver.User');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel    = BugFlow.$forEachParallel;
var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore, roomManager) {

        this._super("User", mongoDataStore);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomManager}
         */
        this.roomManager    = roomManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {airbugserver.User} user
     * @param {function(Error, User)=} callback
     */
    createUser: function(user, callback) {
        this.create(user, callback);
    },

    /**
     *
     */
    deleteUser: function(user, callback){
        //TODO
    },

    /**
     * @param {{
     *      firstName: string,
     *      lastName: string,
     *      email: string
     * }} user
     * @param {function(Error, User)} callback
     */
    findOrCreateUser: function(user, callback) {
        //NOTE this doesn't seem to be used. should also be replaced by saveUser (upsert) function 
        var _this = this;
        //NOTE not sure if this should be searching by email only or by all attributes
        this.retrieveUserByEmail(user.email, function(throwable, userEntity){
            if(!throwable){
                var user = null;
                if(userEntity){
                    user = userEntity;
                    user.commitDelta();
                } else {
                    _this.createUser(user, callback);
                }
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {
     *      anonymous: boolean,
     *      createdAt: Date,
     *      email: string,
     *      firstName: string,
     *      lastName: string,
     *      roomIdSet: (Array.<string> | Set.<string>),
     *      updatedAt: Date
     } data
     */
    generateUser: function(data){
        data.roomIdSet = new Set(data.roomIdSet);
        var user = new User(data);
    },

    /**
     * @param {User} user
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populateUser: function(user, properties, callback){
        var options = {
            propertyNames:  ["roomSet"],
            entityTypes:    ["Room"]
        };
        this.populate(options, user, properties, callback);
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(error, user)} callback
     */
    removeRoomFromUser: function(roomId, userId, callback){
        //TODO
        this.findById(userId, function(error, user){
            if (!error && user){
                user.roomsList.remove(roomId);
                user.save(callback);
            } else if (!error && !user){
                callback(new Error("User not found"), null);
            } else {
                callback(error, user);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    retrieveUser: function(userId, callback){
        this.retrieve(userId, callback);
    },

    /**
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    retrieveUserByEmail: function(email, callback) {
        var _this = this;
        this.dataStore.findOne({email: email}).lean(true).exec(function(throwable, dbUserJson){
            if(!throwable){
                var user = null;
                if(dbUserJson){
                    user = _this.generateUser(dbUserJson);
                    user.commitDelta();
                }
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(Throwable, Map.<string, User>)} callback
     */
    retrieveUsers: function(userIds, callback){
        this.retrieveEach(userIds, callback);
    },

    /**
     * @param {User} user
     * @param {function(Error, User)} callback
     */
     //NOTE updateOrCreate (upsert) equivalent
    saveUser: function(user, callback) {
        //TODO
        if (!user.getCreatedAt()) {
            user.setCreatedAt(new Date());
        }
        user.setUpdatedAt(new Date());
        //TODO BRN:

        user.roomsList.push(roomId);
        user.save(callback);
    },

    /**
     *
     */
    updateUser: function(){
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserManager', UserManager);
