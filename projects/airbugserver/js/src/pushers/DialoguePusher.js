//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.DialoguePusher')
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

    var ArgUtil             = bugpack.require('ArgUtil');
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
    var DialoguePusher = Class.extend(EntityPusher, {

        _name: "airbugserver.DialoguePusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {Dialogue} dialogue
         * @param {function(Throwable=)} callback
         */
        meldCallWithDialogue: function(callUuid, dialogue, callback) {
            this.meldCallWithEntity(callUuid, dialogue, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<Dialogue>} dialogues
         * @param {function(Throwable=)} callback
         */
        meldCallWithDialogues: function(callUuid, dialogues, callback) {
            this.meldCallWithEntities(callUuid, dialogues, callback);
        },

        /**
         * @protected
         * @param {Dialogue} dialogue
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushDialogue: function(dialogue, waitForCallUuids, callback) {
            this.pushEntity(dialogue, waitForCallUuids, callback);
        },

        /**
         * @protected
         * @param {Dialogue} dialogue
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushDialogueToCall: function(dialogue, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(dialogue);
            var data                = this.filterEntity(dialogue);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<Dialogue>} dialogues
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushDialoguesToCall: function(dialogues, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            dialogues.forEach(function(dialogue) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(dialogue);
                var data                = _this.filterEntity(dialogue);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },

        /**
         * @param {User} user
         * @param {Dialogue} dialogue
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithDialogue: function(user, dialogue, callback) {
            this.unmeldUserWithEntity(user, dialogue, callback);
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
                "conversationId",
                "id",
                "userIdPair"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(DialoguePusher).with(
        module("dialoguePusher")
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

    bugpack.export('airbugserver.DialoguePusher', DialoguePusher);
});
