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
        });

        callback();
    },

    /**
     * @private
     * @param {string} attribute
     * @param {function(value) | function(value, response)} validationFunction
     * @param {string} errorMessage
     */
    validate: function(attribute, validationFunction, errorMessage){
        this.schema.path(attribute).validate(validationFunction, errorMessage);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} user
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
     *      name: string,
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserManager', UserManager);
