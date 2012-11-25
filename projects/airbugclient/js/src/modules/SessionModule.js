//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SessionModule')

//@Require('Class')
//@Require('CurrentUserModel')
//@Require('Obj')
//@Require('SessionModel')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.currentUserModel = new CurrentUserModel({});

        /**
         * @private
         * @type {SessionModel}
         */
        this.sessionModel = new SessionModel({});
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
     * @param {string} password
     */
    login: function(email, password) {

    },

    /**
     *
     */
    logout: function() {

    }
});
