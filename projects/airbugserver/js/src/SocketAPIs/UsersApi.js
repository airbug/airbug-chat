//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UsersApi')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.User')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var User        = bugpack.require('airbugserver.User');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UsersApi = Class.extend(Obj, {

    _constructor: function(){

        this._super();

    },

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} userObj
     **/
    establishUser: function(data){
        // create or update
        // set as currentUser
        var query = {email: userObj.email};
        var update = {name: userObj.name};
        var options = {
            new: true,
            upsert: true
        };
        var callback = function(error, user){
            
        };
        User.findOneAndUpdate(query, update, options, callback);
        User.findByEmail(userObj.email, function(error, user){
            if(error){
                console.log(error);
            } else {
                if(!user){
                    user = new User(userObj);
                    user.save();
                    return user;
                }
            }
        });

    },

    updateName: function(data){
        
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UsersApi', UsersApi);

