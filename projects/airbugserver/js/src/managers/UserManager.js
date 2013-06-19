//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')

//@Require('Class')
//@Require('BugManager')


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

var UserManager = Class.extend(BugManager, {

    //-------------------------------------------------------------------------------
    // BugManager Extensions/Overrides
    //-------------------------------------------------------------------------------

    configure: function(callback) {
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.pre('save', function (next){
            if (!this.createdAt) this.createdAt = new Date();
            next();
        });
        this.pre('save', function(next){
            this.updatedAt = new Date();
            next();
        });

        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {} userId
     * @param {} roomId
     * @param {function(Error, User)} callback
     */
    addRoomToUser: function(userId, roomId, callback){
        this.findById(userId, function(error, user){
            if (!error && user){
                user.roomsList.push(roomId);
                user.save(callback);
            } else if (!user){
                callback(new Error("User not found"), user);
            } else {
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
        this.find({_id: id}, callback);
    },

    removeRoomFromUser: function(userId, roomId, callback){
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserManager', UserManager);
