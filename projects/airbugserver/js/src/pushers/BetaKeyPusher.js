//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.BetaKeyPusher')
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
    var BetaKeyPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.BetaKeyPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {BetaKey} betaKey
         * @param {function(Throwable=)} callback
         */
        meldCallWithBetaKey: function(callUuid, betaKey, callback) {
            this.meldCallWithEntity(callUuid, betaKey, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<BetaKey>} betaKeys
         * @param {function(Throwable=)} callback
         */
        meldCallWithBetaKeys: function(callUuid, betaKeys, callback) {
            this.meldCallWithEntities(callUuid, betaKeys, callback);
        },

        /**
         * @protected
         * @param {BetaKey} betaKey
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushBetaKey: function(betaKey, waitForCallUuids, callback) {
            this.pushEntity(betaKey, waitForCallUuids, callback);
        },

        /**
         * @protected
         * @param {BetaKey} betaKey
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushBetaKeyToCall: function(betaKey, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(betaKey);
            var data                = this.filterEntity(betaKey);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<BetaKey>} betaKeys
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushBetaKeysToCall: function(betaKeys, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            betaKeys.forEach(function(betaKey) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(betaKey);
                var data                = _this.filterEntity(betaKey);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },


        //-------------------------------------------------------------------------------
        // EntityPusher Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @protected
         * @param {Entity} entity
         * @return {Object}
         */
        filterEntity: function(entity) {
            return Obj.pick(entity.toObject(), [
                "betaKey",
                "count",
                "isBaseKey"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BetaKeyPusher).with(
        module("betaKeyPusher")
            .args([
                arg().ref("logger"),
                arg().ref("meldBuilder"),
                arg().ref("meldManager"),
                arg().ref("pushManager"),
                arg().ref("betaKeyManager"),
                arg().ref("meldSessionManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.BetaKeyPusher', BetaKeyPusher);
});
