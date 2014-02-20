//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')
//@Autoload

//@Export('AssetManagerModule')

//@Require('Class')
//@Require('airbug.ImageAssetModel')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ImageAssetModel                 = bugpack.require('airbug.ImageAssetModel');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetManagerModule = Class.extend(ManagerModule, {


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} url
     * @param {function(Throwable, MeldDocument=)} callback
     */
    addAssetFromUrl: function(url, callback) {
        var requestData = {url: url};
        this.request("addAssetFromUrl", requestData, callback);
    },

    /**
     * @param {{
     *      name: string
     * }} assetObject
     * @param {function(Throwable, MeldDocument=)} callback
     */
    createAsset: function(assetObject, callback) {
        this.create("Asset", assetObject, callback);
    },

    /**
     * @param {Object=} assetObject
     * @param {MeldDocument=} assetMeldDocument
     * @returns {AssetModel}
     */
//    generateAssetModel: function(assetObject, assetMeldDocument) {
//        return new AssetModel(assetObject, assetMeldDocument);
//    },

    /**
     * @param {Object=} assetObject
     * @param {MeldDocument=} assetMeldDocument
     * @returns {ImageAssetModel}
     */
    generateImageAssetModel: function(assetObject, assetMeldDocument) {
        return new ImageAssetModel(assetObject, assetMeldDocument);
    },

    /**
     * @param {string} assetId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveAsset: function(assetId, callback) {
        this.retrieve("Asset", assetId, callback);
    },

    /**
     * @param {Array.<string>} assetIds
     * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
     */
    retrieveAssets: function(assetIds, callback) {
        this.retrieveEach("Asset", assetIds, callback);
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AssetManagerModule).with(
    module("assetManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AssetManagerModule", AssetManagerModule);
