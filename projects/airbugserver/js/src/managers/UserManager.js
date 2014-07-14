//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserManager')
//@Autoload

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.User')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Set                         = bugpack.require('Set');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var User                        = bugpack.require('airbugserver.User');
    var EntityManager               = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag     = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var entityManager               = EntityManagerTag.entityManager;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var UserManager = Class.extend(EntityManager, {

        _name: "airbugserver.UserManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {User} user
         * @param {(Array.<string> | function(Throwable, User=))} dependencies
         * @param {function(Throwable, User=)=} callback
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
         *      agreedToTermsDate: Date=,
         *      anonymous: boolean,
         *      createdAt: Date=,
         *      email: string=,
         *      firstName: string=,
         *      lastName: string=,
         *      passwordHash: string=,
         *      roomIdSet: (Array.<string> | Set.<string>)=,
         *      updatedAt: Date=
         * }} data
         * @return {User}
         */
        generateUser: function(data) {
            data.roomIdSet = new Set(data.roomIdSet);
            var user = new User(data);
            this.generate(user);
            return user;
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
         * @param {function(Throwable, User=)} callback
         */
        updateUser: function(user, callback) {
            this.update(user, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserManager).with(
        entityManager("userManager")
            .ofType("User")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserManager', UserManager);
});
