//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')
//@Autoload

//@Export('UserAssetManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('airbug.UserImageAssetModel')
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
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var UserImageAssetModel             = bugpack.require('airbug.UserImageAssetModel');
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

var UserAssetManagerModule = Class.extend(ManagerModule, {


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      userId: string,
     *      assetId: string
     * }} userAssetObject
     * @param {function(Throwable, Meld=)} callback
     */
    createUserAsset: function(userAssetObject, callback) {
        this.create("UserAsset", userAssetObject, callback);
    },

    /**
     * @param {string} userAssetId
     * @param {function(Throwable)} callback
     */
    deleteUserAsset: function(userAssetId, callback) {
        this.delete("UserAsset", userAssetId, callback);
    },

    /**
     * @param {Object=} userAssetObject
     * @param {MeldDocument=} userAssetMeldDocument
     * @returns {UserImageAssetModel}
     */
    generateUserImageAssetModel: function(userAssetObject, userAssetMeldDocument) {
        return new UserImageAssetModel(userAssetObject, userAssetMeldDocument);
    },

    /**
     * @param {string} userAssetId
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveUserAsset: function(userAssetId, callback) {
        this.retrieve("UserAsset", userAssetId, callback);
    },

    /**
     * @param {Array.<string>} userAssetIds
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    retrieveAssets: function(userAssetIds, callback) {
        this.retrieveEach("UserAsset", userAssetIds, callback);
    }
});

//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAssetManagerModule).with(
    module("userAssetManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserAssetManagerModule", UserAssetManagerModule);
