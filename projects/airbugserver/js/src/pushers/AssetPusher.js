//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetPusher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetPusher = Class.extend(EntityPusher, {

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

bugmeta.annotate(AssetPusher).with(
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
