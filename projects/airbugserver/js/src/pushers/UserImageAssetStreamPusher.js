//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserImageAssetStreamPusher')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
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

var UserImageAssetStreamPusher = Class.extend(EntityPusher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @param {UserImageAssetStream} userImageAssetStream
     * @param {function(Throwable=)} callback
     */
    meldCallWithUserImageAssetStream: function(callUuid, userImageAssetStream, callback) {
        this.meldCallWithEntity(callUuid, userImageAssetStream, callback);
    },

    /**
     * @param {UserImageAssetStream} userImageAssetStream
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushUserImageAssetStreamToCall: function(userImageAssetStream, callUuid, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(userImageAssetStream);
        var push                = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid])
            .mergeDocument(meldDocumentKey, {})
            .exec(callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UserImageAssetStreamPusher).with(
    module("userImageAssetStreamPusher")
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

bugpack.export('airbugserver.UserImageAssetStreamPusher', UserImageAssetStreamPusher);
