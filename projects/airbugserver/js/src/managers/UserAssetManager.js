//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserAssetManager')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbugserver.UserAsset')
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
var Map                         = bugpack.require('Map');
var TypeUtil                    = bugpack.require('TypeUtil');
var UserAsset                   = bugpack.require('airbugserver.UserAsset');
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

var UserAssetManager = Class.extend(EntityManager, {


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {UserAsset} userAsset
     * @param {(Array.<string> | function(Throwable, UserAsset))} dependencies
     * @param {function(Throwable, UserAsset)} callback
     */
    createUserAsset: function(userAsset, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(userAsset, options, dependencies, callback);
    },

    /**
     * @param {UserAsset} userAsset
     * @param {function(Throwable)} callback
     */
    deleteUserAsset: function(userAsset, callback) {
        this.delete(userAsset, callback);
    },

    /**
     * @param {{
     *      assetId: string,
     *      createdAt: Date,
     *      name: string,
     *      updatedAt: Date,
     *      userId: string
     * }} data
     * @return {UserAsset}
     */
    generateUserAsset: function(data) {
        var userAsset = new UserAsset(data);
        console.log("UserAssetManager#generateUserAsset userAsset = ", userAsset);
        this.generate(userAsset);
        return userAsset;
    },

    /**
     * @param {UserAsset} userAsset
     * @param {Array.<string>} properties
     * @param {function(Throwable, UserAsset)} callback
     */
    populateUserAsset: function(userAsset, properties, callback) {
        var options = {
            asset: {
                idGetter:   userAsset.getAssetId,
                idSetter:   userAsset.setAssetId,
                getter:     userAsset.getAsset,
                setter:     userAsset.setAsset
            },
            user: {
                idGetter:   userAsset.getUserId,
                idSetter:   userAsset.setUserId,
                getter:     userAsset.getUser,
                setter:     userAsset.setUser
            }
        };
        this.populate(userAsset, options, properties, callback);
    },

    /**
     * @param {string} userAssetId
     * @param {function(Throwable, UserAsset)} callback
     */
    retrieveUserAsset: function(userAssetId, callback) {
        this.retrieve(userAssetId, callback);
    },

    /**
     * @param {Array.<string>} userAssetIds
     * @param {function(Throwable, Map.<string, UserAsset>)} callback
     */
    retrieveUserAssets: function(userAssetIds, callback) {
        this.retrieveEach(userAssetIds, callback);
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, Map.<string, UserAsset>)} callback
     */
    retrieveUserAssetsByUserId: function(userId, callback) {
        var _this = this;
        this.dataStore.find({userId: userId}).lean(true).exec(function(throwable, dbObjects) {
            if (!throwable) {
                var newMap = new Map();
                dbObjects.forEach(function(dbObject) {
                    var userAsset = _this.convertDbObjectToEntity(dbObject);
                    userAsset.commitDelta();
                    newMap.put(userAsset.getId(), userAsset);
                });
                callback(undefined, newMap);
            } else {
                callback(throwable, undefined);
            }
        });
    },

    /**
     * @param {UserAsset} userAsset
     * @param {function(Throwable, UserAsset)} callback
     */
    updateUserAsset: function(userAsset, callback) {
        this.update(userAsset, callback);
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAssetManager).with(
    entityManager("userAssetManager")
        .ofType("UserAsset")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAssetManager', UserAssetManager);
