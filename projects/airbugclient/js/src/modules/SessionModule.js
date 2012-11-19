//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SessionModule')

//@Require('Class')
//@Require('Obj')


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
        this.currentUserModel = new UserModel({});
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {UserModel}
     */
    getCurrentUserModel: function() {
        return this.currentUserModel;
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
