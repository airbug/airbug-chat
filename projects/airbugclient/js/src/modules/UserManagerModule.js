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
     * @param {function(error, {*})} callback
     */
    retrieveUser: function(userId, callback) {
        var _this = this;
        this.airbugApi.retrieveUser(userId, function(error, userObj){
            if(!error && userObj){
                _this.put(userObj._id, userObj);
                console.log("Putting user with id of", userObj._id, "into usersMap");
            }
            callback(error, userObj);
        });
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(error, Array.<{*}>)} callback
     */
    retrieveUsers: function(userIds, callback){
        var _this = this;
        this.airbugApi.retrieveUsers(userIds, function(error, userObjs){
            if(!error && userObjs){
                users.forEach(function(userObj){
                    _this.put(userObj._id, userObj);
                });
            }
            callback(error, userObjs);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserManagerModule", UserManagerModule);
