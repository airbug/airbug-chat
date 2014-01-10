//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserAsset')

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
        return this.deltaDocument.getData().assetId;
    },

    /*
     * @param {string} assetId
     */
    setAssetId: function(assetId) {
        this.deltaDocument.getData().assetId = assetId;
    },

    /*
     * @return {string}
     */
    getName: function() {
        return this.deltaDocument.getData().name;
    },

    /*
     * @param {string} name
     */
    setName: function(name) {
        this.deltaDocument.getData().name = name;
    },

    /*
     * @return {string}
     */
    getUserId: function() {
        return this.deltaDocument.getData().userId;
    },

    /*
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaDocument.getData().userId = userId;
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
            throw new Error("Asset must have an id first");
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
            throw new Error("user must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAsset).with(
    entity("UserAsset").properties([
        property("assetId")
            .type("string"),
        property("asset")
            .type("Asset")
            .populates(true),
        property("name")
            .type("string"),
        property("userId")
            .type("string"),
        property("user")
            .type("User")
            .populates(true),
        property("createdAt")
            .type("date"),
        property("updatedAt")
            .type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAsset', UserAsset);
