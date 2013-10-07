//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SessionModule')

//@Require('Class')
//@Require('airbug.CurrentUserModel')
//@Require('airbug.ManagerModule')
//@Require('airbug.SessionModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CurrentUserModel    = bugpack.require('airbug.CurrentUserModel');
var ManagerModule       = bugpack.require('airbug.ManagerModule');
var SessionModel        = bugpack.require('airbug.SessionModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, meldStore) {

        this._super(airbugApi, meldStore);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        //TODO BRN: These modules shouldn't be accessing Models. Instead they should be loading MeldDocuments and
        // then allowing the UI to wrap the meldDocuments in Models when needed

        /**
         * @private
         * @type {UserModel}
         */
        this.currentUserModel   = new CurrentUserModel({});

        /**
         * @private
         * @type {SessionModel}
         */
        this.sessionModel       = new SessionModel({});
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CurrentUserModel}
     */
    getCurrentUserModel: function() {
        return this.currentUserModel;
    },

    /**
     * @return {SessionModel}
     */
    getSessionModel: function() {
        return this.sessionModel;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {string} email
     */
    login: function(email) {

    },

    /**
     *
     */
    logout: function() {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SessionModule", SessionModule);
