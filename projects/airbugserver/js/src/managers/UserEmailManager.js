//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserEmailManager')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Set')
//@Require('airbugserver.UserEmail')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ArgUtil                     = bugpack.require('ArgUtil');
var Class                       = bugpack.require('Class');
var Set                         = bugpack.require('Set');
var UserEmail                   = bugpack.require('airbugserver.UserEmail');
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
var UserEmailManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {UserEmail} userEmail
     * @param {(Array.<string> | function(Throwable, UserEmail=))} dependencies
     * @param {function(Throwable, UserEmail=)=} callback
     */
    createUserEmail: function(userEmail, dependencies, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "userEmail", optional: false, type: "object"},
            {name: "dependencies", optional: true, type: "array"},
            {name: "callback", optional: false, type: "function"}
        ]);
        userEmail      = args.userEmail;
        dependencies    = args.dependencies;
        callback        = args.callback;

        var options         = {};
        this.create(userEmail, options, dependencies, callback);
    },

    /**
     * @param {UserEmail} userEmail
     * @param {function(Throwable)} callback
     */
    deleteUserEmail: function(userEmail, callback) {
        this.delete(userEmail, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      emailId: string,
     *      id: string,
     *      primary: boolean,
     *      updatedAt: Date,
     *      userId: string,
     *      validated: boolean,
     *      validatedAt: Date
     * }} data
     * @return {UserEmail}
     */
    generateUserEmail: function(data) {
        var userEmail = new UserEmail(data);
        this.generate(userEmail);
        return userEmail;
    },

    /**
     * @param {UserEmail} userEmail
     * @param {Array.<string>} properties
     * @param {function(Throwable, UserEmail=)} callback
     */
    populateUserEmail: function(userEmail, properties, callback) {
        var options = {
            email: {
                idGetter:   userEmail.getEmailId,
                getter:     userEmail.getEmail,
                setter:     userEmail.setEmail
            },
            user: {
                idGetter:   userEmail.getUserId,
                getter:     userEmail.getUser,
                setter:     userEmail.setUser
            }
        };
        this.populate(userEmail, options, properties, callback);
    },

    /**
     * @param {string} userEmailId
     * @param {function(Error, UserEmail=)} callback
     */
    retrieveUserEmail: function(userEmailId, callback) {
        this.retrieve(userEmailId, callback);
    },

    /**
     * @param {Array.<string>} userEmailIds
     * @param {function(Throwable, Map.<string, UserEmail>=)} callback
     */
    retrieveUserEmails: function(userEmailIds, callback) {
        this.retrieveEach(userEmailIds, callback);
    },

    /**
     * @param {string} emailId
     * @param {function(Throwable, Set.<UserEmail>=)} callback
     */
    retrieveUserEmailsByEmailId: function(emailId, callback) {
        var _this = this;
        this.getDataStore().find({emailId: emailId}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newSet = new Set();
                dbObjects.forEach(function(dbObject) {
                    var chatMessage = _this.convertDbObjectToEntity(dbObject);
                    chatMessage.commitDelta();
                    newSet.add(chatMessage);
                });
                callback(null, newSet);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {UserEmail} userEmail
     * @param {function(Throwable, UserEmail=)} callback
     */
    updateUserEmail: function(userEmail, callback) {
        this.update(userEmail, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UserEmailManager).with(
    entityManager("userEmailManager")
        .ofType("UserEmail")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore"),
            arg().ref("entityDeltaBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserEmailManager', UserEmailManager);
