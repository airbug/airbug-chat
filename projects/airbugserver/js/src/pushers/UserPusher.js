//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserPusher')
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
    var UserPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.UserPusher",


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
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushUser: function(user, waitForCallUuids, callback) {
            this.pushEntity(user, waitForCallUuids, callback);
        },

        /**
         * @protected
         * @param {User} user
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushUserToCall: function(user, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(user);
            var data                = this.filterEntity(user);
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
                var data                = _this.filterEntity(user);
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

    bugmeta.tag(UserPusher).with(
        module("userPusher")
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

    bugpack.export('airbugserver.UserPusher', UserPusher);
});
