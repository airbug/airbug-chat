//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('airbugserver.User')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Set                         = bugpack.require('Set');
var User                        = bugpack.require('airbugserver.User');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {airbugserver.User} user
     * @param {function(Error, User)=} callback
     */
    createUser: function(user, callback) {
        this.create(user, callback);
    },

    /**
     * @param {User} user
     * @param {function(Throwable)} callback
     */
    deleteUser: function(user, callback){
        this.delete(user, callback);
    },

    /**
     * @param {{
     *      firstName: string,
     *      lastName: string,
     *      email: string
     * }} user
     * @param {function(Error, User)} callback
     */
    findOrCreateUser: function(user, callback) {
        //NOTE this doesn't seem to be used. should also be replaced by saveUser (upsert) function 
        var _this = this;
        //NOTE not sure if this should be searching by email only or by all attributes
        this.retrieveUserByEmail(user.email, function(throwable, userEntity){
            if(!throwable){
                var user = null;
                if(userEntity){
                    user = userEntity;
                    user.commitDelta();
                } else {
                    _this.createUser(user, callback);
                }
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {
     *      anonymous: boolean,
     *      createdAt: Date,
     *      email: string,
     *      firstName: string,
     *      lastName: string,
     *      roomIdSet: (Array.<string> | Set.<string>),
     *      updatedAt: Date
     * } data
     * @return {User}
     */
    generateUser: function(data){
        data.roomIdSet = new Set(data.roomIdSet);
        return new User(data);
    },

    /**
     * @param {User} user
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populateUser: function(user, properties, callback){
        var options = {
            roomSet: {
                idGetter:   user.getRoomIdSet,
                getter:     user.getRoomSet
            },
            sessionSet: {
                idGetter: user.getId,
                retriever: "retrieveSessionsByUserId",
                setter: user.setSessionSet
            }
        };
        console.log("UserManager#populateUser");
        this.populate(user, options, properties, callback);
    },

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(error)} callback
     */
    removeRoomFromUser: function(roomId, userId, callback){
        var update = {
            $pull: {
                roomIdSet: roomId
            }
        };
        //TODO SUNG should this also return an Entity. What if there are more than one instance of the same entity created at once?
        this.dataStore.findByIdAndUpdate(userId, update, function(error, dbUser) {
            if (!error && !dbUser){
                callback(new Error("User not found"));
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    retrieveUser: function(userId, callback){
        this.retrieve(userId, callback);
    },

    /**
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    retrieveUserByEmail: function(email, callback) {
        var _this = this;
        this.dataStore.findOne({email: email}).lean(true).exec(function(throwable, dbUserJson){
            if(!throwable){
                var user = null;
                if(dbUserJson){
                    user = _this.generateUser(dbUserJson);
                    user.commitDelta();
                }
                callback(undefined, user);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Array.<string>} userIds
     * @param {function(Throwable, Map.<string, User>)} callback
     */
    retrieveUsers: function(userIds, callback){
        this.retrieveEach(userIds, callback);
    },

    /**
     * @param {User} user 
     * @param {function(Throwable, User)} callback
     */
    updateUser: function(user, callback){
        this.update(user, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserManager).with(
    entityManager("userManager")
        .ofType("User")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserManager', UserManager);
