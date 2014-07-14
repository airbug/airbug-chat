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

//@Export('airbugserver.DialogueManager')
//@Autoload

//@Require('Class')
//@Require('Pair')
//@Require('TypeUtil')
//@Require('airbugserver.Dialogue')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    //TODO BRN: Get rid of this reference to mongoose so that we can break the dependency of the Manager system on mongo

    var mongoose            = require('mongoose');


    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Pair                = bugpack.require('Pair');
    var TypeUtil            = bugpack.require('TypeUtil');
    var Dialogue            = bugpack.require('airbugserver.Dialogue');
    var EntityManager       = bugpack.require('bugentity.EntityManager');
    var EntityManagerTag    = bugpack.require('bugentity.EntityManagerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var entityManager       = EntityManagerTag.entityManager;
    var ObjectId            = mongoose.Types.ObjectId;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityManager}
     */
    var DialogueManager = Class.extend(EntityManager, {

        _name: "airbugserver.DialogueManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Dialogue} dialogue
         * @param {(Array.<string> | function(Throwable, Dialogue=))} dependencies
         * @param {function(Throwable, Dialogue=)=} callback
         */
        createDialogue: function(dialogue, dependencies, callback) {
            if (TypeUtil.isFunction(dependencies)) {
                callback        = dependencies;
                dependencies    = [];
            }

            var options = {
                conversation: {
                    idSetter:   dialogue.setConversationId,
                    setter:     dialogue.setConversation,
                    referenceIdProperty: "ownerId", //Should this be referenceIdSetter? This would require requiring Conversation here.
                    referenceTypeProperty: "ownerType",
                    referenceProperty: "owner" //How should we handle many to many associations?
                }
            };
            this.create(dialogue, options, dependencies, callback);
        },

        /**
         * @param {Dialogue} dialogue
         * @param {function(Throwable=)} callback
         */
        deleteDialogue: function(dialogue, callback) {
            this.delete(dialogue, callback);
        },

        /**
         * @param {{
         *      conversationId: string,
         *      createdAt: Date,
         *      id: string,
         *      updatedAt: Date,
         *      userIdPair: ((Pair.<string> | {a: string, b: string})
         * }} data
         * @return {Dialogue}
         */
        generateDialogue: function(data) {
            data.userIdPair = new Pair(data.userIdPair);
            var dialogue =  new Dialogue(data);
            this.generate(dialogue);
            return dialogue;
        },

        /**
         * @param {Dialogue} dialogue
         * @param {Array.<string>} properties
         * @param {function(Throwable, Dialogue=)} callback
         */
        populateDialogue: function(dialogue, properties, callback) {
            var options = {
                conversation: {
                    idGetter:   dialogue.getConversationId,
                    getter:     dialogue.getConversation,
                    setter:     dialogue.setConversation
                }
            };
            this.populate(dialogue, options, properties, callback);
        },

        /**
         * @param {string} dialogueId
         * @param {function(Throwable, Dialogue=)} callback
         */
        retrieveDialogue: function(dialogueId, callback) {
            this.retrieve(dialogueId, callback);
        },

        /**
         * @param {Pair.<string>} userIdPair
         * @param {function(Throwable, Dialogue=)} callback
         */
        retrieveDialogueByUserIdPair: function(userIdPair, callback) {
            var _this = this;
            this.getDataStore().find({
                "$or": [
                    {
                        userIdPair: {
                            a: new ObjectId(userIdPair.getA()),
                            b: new ObjectId(userIdPair.getB())
                        }
                    },
                    {
                        userIdPair: {
                            a: new ObjectId(userIdPair.getB()),
                            b: new ObjectId(userIdPair.getA())
                        }
                    }
                ]
            }).lean(true).exec(function(throwable, dbObjects) {
                if (!throwable) {
                    var entity = null;
                    if (dbObjects.length > 0) {
                        entity = _this.convertDbObjectToEntity(dbObjects[0]);
                        entity.commitDelta();
                    }
                    callback(null, entity);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {Array.<string>} dialogueIds
         * @param {function(Throwable, Map.<string, Dialogue>=)} callback
         */
        retrieveDialogues: function(dialogueIds, callback) {
            this.retrieveEach(dialogueIds, callback);
        },

        /**
         * @param {Dialogue} dialogue
         * @param {function(Throwable, Dialogue=)} callback
         */
        updateDialogue: function(dialogue, callback) {
            this.update(dialogue, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(DialogueManager).with(
        entityManager("dialogueManager")
            .ofType("Dialogue")
            .args([
                arg().ref("entityManagerStore"),
                arg().ref("schemaManager"),
                arg().ref("entityDeltaBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.DialogueManager', DialogueManager);
});
