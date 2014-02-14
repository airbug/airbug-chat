//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyCounterPusher')
//@Autoload

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

var BetaKeyCounterPusher = Class.extend(EntityPusher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} callUuid
     * @param {BetaKeyCounter} betaKeyCounter
     * @param {function(Throwable=)} callback
     */
    meldCallWithBetaKeyCounter: function(callUuid, betaKeyCounter, callback) {
        this.meldCallWithEntity(callUuid, betaKeyCounter, callback);
    },

    /**
     * @protected
     * @param {string} callUuid
     * @param {Array.<BetaKeyCounter>} betaKeyCounters
     * @param {function(Throwable=)} callback
     */
    meldCallWithBetaKeyCounters: function(callUuid, betaKeyCounters, callback) {
        this.meldCallWithEntities(callUuid, betaKeyCounters, callback);
    },

    /**
     * @protected
     * @param {BetaKeyCounter} betaKeyCounter
     * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
     * @param {function(Throwable=)=} callback
     */
    pushBetaKeyCounter: function(betaKeyCounter, waitForCallUuids, callback) {
        this.pushEntity(betaKeyCounter, waitForCallUuids, callback);
    },

    /**
     * @protected
     * @param {BetaKeyCounter} betaKeyCounter
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushBetaKeyCounterToCall: function(betaKeyCounter, callUuid, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(betaKeyCounter);
        var data                = this.filterEntity(betaKeyCounter);
        var push                = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid])
            .setDocument(meldDocumentKey, data)
            .exec(callback);
    },

    /**
     * @protected
     * @param {Array.<BetaKeyCounter>} betaKeyCounters
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushBetaKeyCountersToCall: function(betaKeyCounters, callUuid, callback) {
        var _this   = this;
        var push    = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid]);
        betaKeyCounters.forEach(function(betaKeyCounter) {
            var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(betaKeyCounter);
            var data                = _this.filterEntity(betaKeyCounter);
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

bugmeta.annotate(BetaKeyCounterPusher).with(
    module("betaKeyCounterPusher")
        .args([
            arg().ref("meldBuilder"),
            arg().ref("meldManager"),
            arg().ref("pushManager"),
            arg().ref("betaKeyCounterManager"),
            arg().ref("meldSessionManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyCounterPusher', BetaKeyCounterPusher);
