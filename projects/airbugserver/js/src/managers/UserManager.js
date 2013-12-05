//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
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
var TypeUtil                    = bugpack.require('TypeUtil');
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

/**
 * @constructor
 * @extends {EntityManager}
 */
var UserManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} user
     * @param {(Array.<string> | function(Throwable, User))} dependencies
     * @param {function(Throwable, User)=} callback
     */
    createUser: function(user, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(user, options, dependencies, callback);
    },

    /**
     * @param {User} user
     * @param {function(Throwable)} callback
     */
    deleteUser: function(user, callback) {
        this.delete(user, callback);
    },

    /**
     * @param {{
     *      anonymous: boolean,
     *      createdAt: Date,
     *      email: string,
     *      firstName: string,
     *      lastName: string,
     *      passwordHash: string,
     *      roomIdSet: (Array.<string> | Set.<string>),
     *      updatedAt: Date
     * }} data
     * @return {User}
     */
    generateUser: function(data) {
        data.roomIdSet = new Set(data.roomIdSet);
        return new User(data);
    },

    /**
     * @param {User} user
     * @param {Array.<string>} properties
     * @param {function(Throwable)} callback
     */
    populateUser: function(user, properties, callback) {
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
        this.populate(user, options, properties, callback);
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, User)} callback
     */
    retrieveUser: function(userId, callback) {
        this.retrieve(userId, callback);
    },

    /**
     * @param {string} email
     * @param {function(Throwable, User)} callback
     */
    retrieveUserByEmail: function(email, callback) {
        var _this = this;
        this.dataStore.findOne({email: email}).lean(true).exec(function(throwable, dbObject) {
            if (!throwable) {
                var user = null;
                if (dbObject) {
                    user = _this.convertDbObjectToEntity(dbObject);
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
    retrieveUsers: function(userIds, callback) {
        this.retrieveEach(userIds, callback);
    },

    /**
     * @param {User} user
     * @param {function(Throwable, User)} callback
     */
    updateUser: function(user, callback) {
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
