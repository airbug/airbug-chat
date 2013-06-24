//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.CurrentUserModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var CurrentUserModel    = bugpack.require('airbug.CurrentUserModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserManagerModule = Class.extend(Obj, {

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
        this.airbugApi          = airbugApi;

        /**
         * @private
         * @type {CurrentUser}
         */
        this.currentUserModel   = new CurrentUserModel({});

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {{
     *      email: string,
     *      firstName: string,
     *      lastName: string
     * }} userObj
     * @param {function(error, currentUser)} callback
     */
    establishCurrentUser: function(userObj, callback) {
        this.airbugApi.establishCurrentUser(userObj, callback);
    },

    /**
     * @param {function(error, currentUser)} callback
     */
    getCurrentUser: function(callback) {
        this.airbugApi.getCurrentUser(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
