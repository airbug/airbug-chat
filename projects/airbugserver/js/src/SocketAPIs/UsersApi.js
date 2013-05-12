//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UsersApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var User        = bugpack.require('airbugserver.User');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UsersApi = {

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
        var callback = function(){
            
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

    }

    updateName: function(data){
        
    },

}


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UsersApi', UsersApi);

