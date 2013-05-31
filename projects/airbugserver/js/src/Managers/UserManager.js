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

        Proxy.proxy(this, this.model, [
            'findById'
        ]);

        Proxy.proxy(this, this.schema, [
            'pre',
            'post',
            'virtual'
        ]);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.pre('save', function (next){
            if (!this.createdAt) this.createdAt = new Date();
            next();
        });
        this.pre('save', function(next){
            this.updatedAt = new Date();
        });

        callback();
    },

    getModel: function(){
        return this.model;
    },

    getSchema: function(){
        return this.schema;
    },

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
     * }} user
     * @param {function(Error, User)} callback
     **/
    findOrCreate: function(user, callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        var _this       = this;
        var User        = this.model;
        var userObj     = user;
        var conditions  = {email: userObj.email};
        var fields      = null;
        var options     = {lean: false};

        // User.findOneAndUpdate(query, update, options, otherCallback); //cannot use pre post hooks with this method
        User.findOne(conditions, fields, options, function(error, user){
            if(error){
                callback(error);
            } else {
                if(!user){
                    User.create(userObj, callback);
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
