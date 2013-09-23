//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel   = BugFlow.$parallel;
var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {

        this._super(mongoDataStore);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MongoManager}
         */
        this.dataStore              = mongoDataStore.generateManager("User");
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      firstName: string,
     *      lastName: string,
     *      email: string
     * }} user
     * @param {function(Error, User)=} callback
     */
    createUser: function(user, callback) {
        this.create(user, function(error, user) {
            if (callback) {
                callback(error, user);
            }
        });
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
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var User        = this.model;
        var userObj     = user;
        var conditions  = {email: userObj.email};
        var fields      = null;
        var options     = {lean: false};

        User.findOne(conditions, fields, options, function(error, user){
            if (error) {
                callback(error);
            } else {
                if (!user) {
                    User.create(userObj, callback);
                } else {
                    callback(null, user);
                }
            }
        });
    },

    /**
     * @param {string} id
     * @param {function(Error, User)} callback
     */
    findUserById: function(id, callback) {
        this.findById(id, callback);
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(error, user)} callback
     */
    removeRoomFromUser: function(roomId, userId, callback){
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
     * @param {User} user
     * @param {function(Error, User)} callback
     */
    saveUser: function(user, callback) {
        if (!user.getCreatedAt()) {
            user.setCreatedAt(new Date());
        }
        user.setUpdatedAt(new Date());
        //TODO BRN:

        user.roomsList.push(roomId);
        user.save(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserManager', UserManager);
