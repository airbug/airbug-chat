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
    get: function(id) {
        return this.usersMap.get(id);
    },

    /**
     * @param {string} id
     * @return {userObj}
     */
    put: function(id, room) {
        this.usersMap.put(id, room);
    },

    /**
     * @param {string} id
     * @return {userObj}
     */
    remove: function(id){
        this.usersMap.remove(id);
    },

    clearCache: function(){
        this.usersMap.clear();
    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {string} userId
     * @param {function(error, {*})} callback
     */
    retrieveUser: function(userId, callback) {
        console.log("Retrieving user:", userId);
        var _this   = this;
        var userObj = this.get(userId);
        if(userObj){
            callback(null, userObj)
        } else {
            this.airbugApi.retrieveUser(userId, function(error, userObj){
                if(!error && userObj){
                    _this.put(userObj._id, userObj);
                }
                callback(error, userObj);
            });
        }
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(error, Array.<{*}>)} callback
     */
    retrieveUsers: function(userIds, callback){
        var _this = this;
        var users = [];
        for(var i = 0; i < cachedUsers.length; i++){
            var userObj = this.get(userIds[i]);
            if(userObj){
                users.push(userObj);
                this.put(userIds[i], userObj);
                userIds.splice(i, 0);
            }
        }

        this.airbugApi.retrieveUsers(userIds, function(error, userObjs){
            if(!error && userObjs){
                usersObj.forEach(function(userObj){
                    users.push(userObj);
                    _this.put(userObj._id, userObj);
                });
            }
            callback(error, users);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserManagerModule", UserManagerModule);
