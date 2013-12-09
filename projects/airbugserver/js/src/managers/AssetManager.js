//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetManager')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('TypeUtil')
//@Require('airbugserver.Asset')
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
var Asset                       = bugpack.require('airbugserver.Asset');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TypeUtil                    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Asset} asset
     * @param {(Array.<string> | function(Throwable, Asset))} dependencies
     * @param {function(Asset, Throwable)=} callback
     */
    createAsset: function(asset, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(asset, options, dependencies, callback);
    },

    /**
     * @param {Asset} asset
     * @param {function(Throwable)} callback
     */
    deleteAsset: function(asset, callback) {
        this.delete(asset, callback);
    },

    /**
     * @param {{
     *      createdAt: Date,
     *      mimeType: string,
     *      thumbMimeType: string,
     *      thumbUrl: string,
     *      updatedAt: Date,
     *      url: string
     * }} data
     * @return {Asset}
     */
    generateAsset: function(data) {
        var asset = new Asset(data);
        this.generate(asset);
        return asset;
    },

    populateAsset: function(asset, properties, callback) {
        //TODO: dkk - anything needed here?
    },

    /**
     * @param {Array.<string>} assetId
     * @param {function(Throwable, Asset)} callback
     */
    retrieveAsset: function(assetId, callback) {
        this.retrieve(assetId, callback);
    },

    /**
     * @param {Array.<string>} assetIds
     * @param {function(Throwable, Map.<string, Asset>)} callback
     */
    retrieveAssets: function(assetIds, callback) {
        this.retrieveEach(assetIds, callback);
    },

    /**
     * @param {Asset} asset
     * @param {function(Throwable, Asset)} callback
     */
    updateAsset: function(asset, callback) {
        this.update(asset, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AssetManager).with(
    entityManager("assetManager")
        .ofType("Asset")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetManager', AssetManager);
