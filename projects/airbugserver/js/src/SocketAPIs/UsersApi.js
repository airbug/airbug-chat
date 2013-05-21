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
        // this.model = User;
        // this.socketManager = SocketManager;

    },

    /*
     * @param {{
     *      name: string,
     *      email: string
     * }} userObj
     **/
    establishUser: function(data){
        var userObj = {email: data.email, name: data.name};
        var callback = function(error, currentUser){
            if(!error && currentUser){
                currentUser = currentUser; //make sure this currentUser variable is the proper one
                SocketManager.addEstablishedUserListeners(socket); //make sure this socket is the proper one
            } else if (!error && !error) {
                
            } else {
                console.log(error);
            }
        };

        // UsersApi.establishUser(userObj, callback);
        // create or update
        // set as currentUser
        var query = {email: userObj.email};
        var update = {name: userObj.name};
        var options = {
            new: true,
            upsert: true
        };

        User.findOneAndUpdate(query, update, options, callback); //cannot use pre post hooks with this method
        // User.findByEmail(userObj.email, function(error, user){
        //     if(error){
        //         console.log(error);
        //     } else {
        //         if(!user){
        //             user = new User(userObj);
        //             user.save();
        //             return user;
        //         }
        //     }
        // });

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UsersApi', UsersApi);

