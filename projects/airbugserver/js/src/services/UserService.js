//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserService')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(userManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager = userManager;
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
     *      name: string,
     *      email: string
     * }} user
     * @param {function(Error, User)} callback
     */
    establishUser: function(user, callback) {
        var _this = this;
        this.userManager.findOrCreate(user, function(error, user) {
            if (!error) {
                callback(null, user);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {} 
     */
    logoutUser: function(callback){
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserService', UserService);

