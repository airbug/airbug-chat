//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var Proxy       = bugpack.require('Proxy');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserInterface = {
    establishUser: function(){},
};

// Implementation
var UserManager = Class.extend(Obj, {

    _constructor: function(model, schema){

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @type {mongoose.Model.User}
         */
        this.model = model;

        /**
         * @type {mongoose.Schema.UserSchema}
         */
        this.schema = schema;

        Proxy.proxy(this, this.schema, [
            'pre',
            'post'
        ]);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {string} attribute
     * @param {function(value) | function(value, response)} validationFunction
     * @param {string} errorMessage
     **/
    validate: function(attribute, validationFunction, errorMessage){
        this.schema.path(attribute).validate(validationFunction, errorMessage);
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

bugpack.export('airbugserver.UserManager', UserManager);
