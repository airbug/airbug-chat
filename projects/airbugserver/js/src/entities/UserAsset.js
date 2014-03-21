//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserAsset')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserAsset = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Asset}
         */
        this.asset          = undefined;

        /**
         * @private
         * @type {User}
         */
        this.user           = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /*
     * @return {string}
     */
    getAssetId: function() {
        return this.getEntityData().assetId;
    },

    /*
     * @param {string} assetId
     */
    setAssetId: function(assetId) {
        this.getEntityData().assetId = assetId;
    },

    /*
     * @return {string}
     */
    getName: function() {
        return this.getEntityData().name;
    },

    /*
     * @param {string} name
     */
    setName: function(name) {
        this.getEntityData().name = name;
    },

    /*
     * @return {string}
     */
    getUserId: function() {
        return this.getEntityData().userId;
    },

    /*
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.getEntityData().userId = userId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Asset}
     */
    getAsset: function() {
        return this.asset;
    },

    /**
     * @param {Asset} asset
     */
    setAsset: function(asset) {
        if (asset.getId()) {
            this.asset = asset;
            this.setAssetId(asset.getId());
        } else {
            throw new Bug("IllegalState", {}, "Asset must have an id first");
        }
    },

    /**
     * @return {User}
     */
    getUser: function() {
        return this.user;
    },

    /**
     * @param {User} user
     */
    setUser: function(user) {
        if (user.getId()) {
            this.user = user;
            this.setUserId(user.getId());
        } else {
            throw new Bug("IllegalState", {}, "user must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAsset).with(
    entity("UserAsset").properties([
        property("assetId")
            .type("string")
            .index(true)
            .require(true)
            .id(),
        property("asset")
            .type("Asset")
            .populates(true)
            .store(false),
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("id")
            .type("string")
            .primaryId(),
        property("name")
            .type("string"),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("userId")
            .type("string")
            .require(true)
            .index(true)
            .id(),
        property("user")
            .type("User")
            .populates(true)
            .store(false)
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAsset', UserAsset);
