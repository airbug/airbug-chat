//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserApi')

//@Require('Class')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserInterface = {
    establishUser: function(){},
};

// Implementation
var UserApi = Class.extend(Obj, {

    _constructor: function(model){

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @type {mongoose.Model.User}
         */
        this.model = model;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} data
     * @param {function(Error, User)} callback
     **/
    establishUser: function(data, callback){ //findOrCreate
        this.findOrCreate(data, callback);
    },

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} data
     * @param {function(Error, User)} callback
     **/
    findOrCreate: function(data, callback){
        var _this       = this;
        var userObj     = {email: data.email, name: data.name}; // sanitizing the data
        var conditions  = {email: userObj.email};
        var fields      = null;
        var options = {
            lean: false;
        };

        // this.model.findOneAndUpdate(query, update, options, otherCallback); //cannot use pre post hooks with this method
        this.model.findOne(conditions, fields, options, function(error, user){
            if(error){
                callback(error);
            } else {
                if(!user){
                    _this.model.create(userObj, callback);
                } else {
                    callback(null, user);
                }
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserApi', UserApi);
