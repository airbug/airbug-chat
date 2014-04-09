//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.DialogueManagerModule')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Map')
//@Require('airbug.DialogueList')
//@Require('airbug.DialogueModel')
//@Require('airbug.ManagerModule')
//@Require('airbug.RetrieveDialogueByUserIdForCurrentUserRequest')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                                             = bugpack.require('ArgUtil');
var Class                                               = bugpack.require('Class');
var Map                                                 = bugpack.require('Map');
var ManagerModule                                       = bugpack.require('airbug.ManagerModule');
var DialogueList                                        = bugpack.require('airbug.DialogueList');
var DialogueModel                                       = bugpack.require('airbug.DialogueModel');
var RetrieveDialogueByUserIdForCurrentUserRequest       = bugpack.require('airbug.RetrieveDialogueByUserIdForCurrentUserRequest');
var ArgAnnotation                                       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                                    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                                             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                                                 = ArgAnnotation.arg;
var bugmeta                                             = BugMeta.context();
var module                                              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ManagerModule}
 */
var DialogueManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {AirbugApi} airbugApi
     * @param {MeldStore} meldStore
     * @param {MeldBuilder} meldBuilder
     * @param {dialogueMemoryCache} dialogueMemoryCache
     */
    _constructor: function(airbugApi, meldStore, meldBuilder, dialogueMemoryCache) {

        this._super(airbugApi, meldStore, meldBuilder);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MemoryCache}
         */
        this.dialogueMemoryCache    = dialogueMemoryCache;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MemoryCache}
     */
    getDialogueMemoryCache: function() {
        return this.dialogueMemoryCache;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      userIdPair: Pair.<string>
     * }} dialogueObject
     * @param {function(Throwable, MeldDocument=)} callback
     */
    createDialogue: function(dialogueObject, callback) {
        this.create("Dialogue", dialogueObject, callback);
    },

    /**
     * @param {IList=} dataList
     * @return {DialogueList}
     */
    generateDialogueList: function(dataList) {
        return new DialogueList(dataList);
    },

    /**
     * @param {Object=} dialogueObject
     * @param {MeldDocument=} dialogueMeldDocument
     * @returns {DialogueModel}
     */
    generateDialogueModel: function(dialogueObject, dialogueMeldDocument) {
        return new DialogueModel(dialogueObject, dialogueMeldDocument);
    },

    /**
     * @param {string} dialogueId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveDialogue: function(dialogueId, callback) {
        this.retrieve("Dialogue", dialogueId, callback);
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveDialogueByUserIdForCurrentUser: function(userId, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "userId", optional: false, type: "string"},
            {name: "callback", optional: false, type: "function"}
        ]);
        userId      = args.userId;
        callback    = args.callback;

        //TODO BRN: Instead of using a memory cache here. Perhaps we should introduce some type of index/query system in
        // to the MeldStore so that we could query for a document that matches our criteria

        var meldDocument    = this.getDialogueForUserIdFromCache(userId);
        if (meldDocument) {
            callback(null, meldDocument);
        } else {
            var request = this.generateRetrieveDialogueByUserIdForCurrentUserRequest(userId);
            request.addCallback(callback);
            this.getAirbugApi().sendApiRequest(request, function(throwable, outgoingRequest) {
                if (throwable) {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @param {Array.<string>} dialogueIds
     * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
     */
    retrieveDialogues: function(dialogueIds, callback) {
        this.retrieveEach("Dialogue", dialogueIds, callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} userId
     * @param {MeldBuilder} meldBuilder
     * @param {MeldStore} meldStore
     * @param {MemoryCache} dialogueMemoryCache
     * @returns {RetrieveDialogueByUserIdForCurrentUserRequest}
     */
    factoryRetrieveDialogueByUserIdForCurrentUserRequest: function(userId, meldBuilder, meldStore, dialogueMemoryCache) {
        return new RetrieveDialogueByUserIdForCurrentUserRequest(userId, meldBuilder, meldStore, dialogueMemoryCache);
    },

    /**
     * @private
     * @param {string} userId
     * @return {MeldDocument}
     */
    getDialogueForUserIdFromCache: function(userId) {
        var dialogueId      = this.dialogueMemoryCache.getCache(userId);
        if (dialogueId) {
            var meldDocumentKey     = this.getMeldBuilder().generateMeldDocumentKey("Dialogue", dialogueId);
            return this.getMeldStore().getMeldDocumentByMeldDocumentKey(meldDocumentKey);
        }
        return null;
    },

    /**
     * @private
     * @param {string} userId
     * @returns {RetrieveDialogueByUserIdForCurrentUserRequest}
     */
    generateRetrieveDialogueByUserIdForCurrentUserRequest: function(userId) {
        var apiRequest = this.factoryRetrieveDialogueByUserIdForCurrentUserRequest(userId, this.getMeldBuilder(), this.getMeldStore(), this.dialogueMemoryCache);
        if (this.hasActiveApiRequest(apiRequest)) {
            return /** @type {RetrieveDialogueByUserIdForCurrentUserRequest} */ (this.getActiveApiRequest(apiRequest));
        } else {
            this.addActiveApiRequest(apiRequest);
            return apiRequest;
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(DialogueManagerModule).with(
    module("dialogueManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder"),
            arg().ref("dialogueMemoryCache")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DialogueManagerModule", DialogueManagerModule);
