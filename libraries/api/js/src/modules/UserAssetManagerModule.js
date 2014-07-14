/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Autoload

//@Export('airbug.UserAssetManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ManagerModule   = bugpack.require('airbug.ManagerModule');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var UserAssetManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.UserAssetManagerModule",


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

    bugmeta.tag(UserAssetManagerModule).with(
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
});
