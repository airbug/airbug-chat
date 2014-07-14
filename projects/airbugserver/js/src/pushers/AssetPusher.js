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

//@Export('airbugserver.AssetPusher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
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

    var ArgUtil         = bugpack.require('ArgUtil');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var EntityPusher    = bugpack.require('airbugserver.EntityPusher');
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
     * @extends {EntityPusher}
     */
    var AssetPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.AssetPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {Asset} asset
         * @param {function(Throwable=)} callback
         */
        meldCallWithAsset: function(callUuid, asset, callback) {
            this.meldCallWithEntity(callUuid, asset, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<Asset>} assets
         * @param {function(Throwable=)} callback
         */
        meldCallWithAssets: function(callUuid, assets, callback) {
            this.meldCallWithEntities(callUuid, assets, callback);
        },

        /**
         * @protected
         * @param {Asset} asset
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushAssetToCall: function(asset, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(asset);
            var data                = this.filterEntity(asset);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<Asset>} assets
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushAssetsToCall: function(assets, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            assets.forEach(function(asset) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(asset);
                var data                = _this.filterEntity(asset);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },


        //-------------------------------------------------------------------------------
        // EntityPusher Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Entity} entity
         * @return {Object}
         */
        filterEntity: function(entity) {
            return Obj.pick(entity.toObject(), [
                "id",
                "midsizeMimeType",
                "midsizeUrl",
                "mimeType",
                "name",
                "thumbnailMimeType",
                "thumbnailUrl",
                "type",
                "url"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AssetPusher).with(
        module("assetPusher")
            .args([
                arg().ref("logger"),
                arg().ref("meldBuilder"),
                arg().ref("meldManager"),
                arg().ref("pushManager"),
                arg().ref("userManager"),
                arg().ref("meldSessionManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AssetPusher', AssetPusher);
});
