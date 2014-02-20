//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')
//@Autoload

//@Export('UserAssetManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('airbug.UserImageAssetList')
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
var UserImageAssetList              = bugpack.require('airbug.UserImageAssetList');
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
     * @param {IList=} dataList
     * @returns {UserImageAssetList}
     */
    generateUserImageAssetList: function(dataList) {
        return new UserImageAssetList(dataList);
    },

    /**
     * @param {Object=} userAssetObject
     * @param {MeldDocument=} imageAssetMeldDocument
     * @param {MeldDocument=} userAssetMeldDocument
     * @returns {UserImageAssetModel}
     */
    generateUserImageAssetModel: function(userAssetObject, imageAssetMeldDocument, userAssetMeldDocument) {
        return new UserImageAssetModel(userAssetObject, imageAssetMeldDocument, userAssetMeldDocument);
    },

    /**
     * @param {string} userAssetId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveUserAsset: function(userAssetId, callback) {
        this.retrieve("UserAsset", userAssetId, callback);
    },

    /**
     * @param {Array.<string>} userAssetIds
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    retrieveUserAssets: function(userAssetIds, callback) {
        this.retrieveEach("UserAsset", userAssetIds, callback);
    },

    /**
     * @param {function(Throwable, List.<MeldDocument>=)} callback
     */
    retrieveUserAssetsForCurrentUser: function(callback) {
        var _this = this;
        this.request("retrieveUserAssetsForCurrentUser", {}, function(throwable, callResponse) {
            _this.processListRetrieveResponse(throwable, callResponse, "UserAsset", callback);
        });
    },

    /**
     * @param {function(Throwable, List.<MeldDocument>=)} callback
     */
    retrieveUserAssetsForCurrentUserSortByCreatedAt: function(callback) {
        var _this = this;
        this.request("retrieveUserAssetsForCurrentUserSortByCreatedAt", {}, function(throwable, callResponse) {
            _this.processListRetrieveResponse(throwable, callResponse, "UserAsset", callback);
        });
    },

    /**
     * @param {function(Throwable, List.<MeldDocument>=)} callback
     */
    retrieveUserImageAssetsForCurrentUser: function(callback) {
        var _this = this;
        this.request("retrieveUserImageAssetsForCurrentUser", {}, function(throwable, callResponse) {
            _this.processListRetrieveResponse(throwable, callResponse, "UserAsset", callback);
        });
    },

    /**
     * @param {Array.<string>} userId
     * @param {function(Throwable, List.<Meld>=)} callback
     */
    retrieveUserAssetsByUserId: function(userId, callback) {
        var _this = this;
        this.request("retrieveUserAssetsByUserId", {objectId: userId}, function(throwable, callResponse) {
            _this.processListRetrieveResponse(throwable, callResponse, "UserAsset", callback);
        });
    },

    /**
     * @param {Array.<string>} userId
     * @param {function(Throwable, List.<Meld>=)} callback
     */
    retrieveUserImageAssetsByUserId: function(userId, callback) {
        var _this = this;
        this.request("retrieveUserImageAssetsByUserId", {objectId: userId}, function(throwable, callResponse) {
            _this.processListRetrieveResponse(throwable, callResponse, "UserAsset", callback);
        });
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
