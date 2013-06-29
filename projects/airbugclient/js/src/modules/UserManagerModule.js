//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserManagerModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi  = airbugApi;

        /**
         * @private
         * @type {Map}
         */
        this.usersMap   = new Map();

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} id
     * @return {userObj}
     */
    get: function(id){
        return this.usersMap.get(id);
    },

    /**
     * @param {string} id
     * @return {userObj}
     */
    put: function(id, room){
        this.usersMap.put(id, room);
    },

    /**
     * @param {string} id
     * @return {userObj}
     */
    remove: function(id){
        this.usersMap.remove(id);
    },

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {string} userId
     * @param {function(error, userObj)} callback
     */
    retrieveUser: function(userId, callback) {
        var _this = this;
        this.airbugApi.retrieveUser(userId, function(error, user){
            if(!error && user){
                _this.put(user._id, user);
                console.log("Putting user with id of", user._id, "into usersMap");
                callback(error, user);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserManagerModule", UserManagerModule);
