//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserAssetPusher')
//@Autoload

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

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
    var ArgTag       = bugpack.require('bugioc.ArgTag');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityPusher}
     */
    var UserAssetPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.UserAssetPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {UserAsset} userAsset
         * @param {function(Throwable=)} callback
         */
        meldCallWithUserAsset: function(callUuid, userAsset, callback) {
            this.meldCallWithEntity(callUuid, userAsset, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<UserAsset>} userAssets
         * @param {function(Throwable=)} callback
         */
        meldCallWithUserAssets: function(callUuid, userAssets, callback) {
            this.meldCallWithEntities(callUuid, userAssets, callback);
        },

        /**
         * @param {UserAsset} userAsset
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushRemoveUserAssetToCall: function(userAsset, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(userAsset);
            var push                = this.push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .removeDocument(meldDocumentKey)
                .exec(callback);
        },

        /**
         * @protected
         * @param {UserAsset} userAsset
         * @param {function(Throwable=)} callback
         */
        pushUserAsset: function(userAsset, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(userAsset);
            var data                = this.filterUserAsset(userAsset);
            var push                = this.getPushManager().push();
            push
                .toAll()
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {UserAsset} userAsset
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushUserAssetToCall: function(userAsset, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(userAsset);
            var data                = this.filterUserAsset(userAsset);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<UserAsset>} userAssets
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushUserAssetsToCall: function(userAssets, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            userAssets.forEach(function(userAsset) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(userAsset);
                var data                = _this.filterUserAsset(userAsset);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },

        /**
         *
         * @param {UserImageAssetStream} userImageAssetStream
         * @param {UserAsset} userImageAsset
         * @param {function(Throwable=)} callback
         */
        streamUserImageAsset: function(userImageAssetStream, userImageAsset, callback) {
            var userImageAssetStreamKey     = this.generateMeldDocumentKeyFromEntity(userImageAssetStream);
            var push                        = this.getPushManager().push();
            push
                .toAll()
                .addToSet(userImageAssetStreamKey, "userImageAssetIdSet", userImageAsset.getId())
                .exec(callback);
        },

        /**
         * @param {User} user
         * @param {UserAsset} userAsset
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithUserAsset: function(user, userAsset, callback) {
            this.unmeldUserWithEntity(user, userAsset, callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {UserAsset} userAsset
         * @return {Object}
         */
        filterUserAsset: function(userAsset) {
            return Obj.pick(userAsset.toObject(), [
                "assetId",
                "id",
                "userId"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserAssetPusher).with(
        module("userAssetPusher")
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

    bugpack.export('airbugserver.UserAssetPusher', UserAssetPusher);
});
