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
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AssetPusher).with(
    module("assetPusher")
        .args([
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
