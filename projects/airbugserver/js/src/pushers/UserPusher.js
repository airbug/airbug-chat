//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserPusher')
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

var UserPusher = Class.extend(EntityPusher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} callUuid
     * @param {User} user
     * @param {function(Throwable=)} callback
     */
    meldCallWithUser: function(callUuid, user, callback) {
        this.meldCallWithEntity(callUuid, user, callback);
    },

    /**
     * @protected
     * @param {string} callUuid
     * @param {Array.<User>} users
     * @param {function(Throwable=)} callback
     */
    meldCallWithUsers: function(callUuid, users, callback) {
        this.meldCallWithEntities(callUuid, users, callback);
    },

    /**
     * @protected
     * @param {User} user
     * @param {function(Throwable=)} callback
     */
    pushUser: function(user, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(user);
        var data                = this.filterUser(user);
        var push                = this.getPushManager().push();
        push
            .toAll()
            .setDocument(meldDocumentKey, data)
            .exec(callback);
    },

    /**
     * @protected
     * @param {User} user
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushUserToCall: function(user, callUuid, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(user);
        var data                = this.filterUser(user);
        var push                = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid])
            .setDocument(meldDocumentKey, data)
            .exec(callback);
    },

    /**
     * @protected
     * @param {Array.<User>} users
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushUsersToCall: function(users, callUuid, callback) {
        var _this   = this;
        var push    = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid]);
        users.forEach(function(user) {
            var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(user);
            var data                = _this.filterUser(user);
            push.setDocument(meldDocumentKey, data)
        });
        push.exec(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {User} user
     * @return {Object}
     */
    filterUser: function(user) {
        return Obj.pick(user.toObject(), [
            "anonymous",
            "email",
            "firstName",
            "id",
            "lastName",
            "roomIdSet",
            "status"
        ]);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserPusher).with(
    module("userPusher")
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

bugpack.export('airbugserver.UserPusher', UserPusher);
