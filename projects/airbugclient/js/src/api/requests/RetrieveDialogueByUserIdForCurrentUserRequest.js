//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RetrieveDialogueByUserIdForCurrentUserRequest')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbug.ApiDefines')
//@Require('airbug.ApiRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var ApiDefines              = bugpack.require('airbug.ApiDefines');
var ApiRequest              = bugpack.require('airbug.ApiRequest');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ApiRequest}
 */
var RetrieveDialogueByUserIdForCurrentUserRequest = Class.extend(ApiRequest, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} userId
     * @param {MeldBuilder} meldBuilder
     * @param {MeldStore} meldStore
     * @param {MemoryCache} dialogueMemoryCache
     */
    _constructor: function(userId, meldBuilder, meldStore, dialogueMemoryCache) {
        var requestData = {
            userId: userId
        };
        this._super("retrieveDialogueByUserIdForCurrentUser", requestData);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MemoryCache}
         */
        this.dialogueMemoryCache    = dialogueMemoryCache;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder            = meldBuilder;

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore              = meldStore;

        /**
         * @private
         * @type {string}
         */
        this.userId                 = userId;
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

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },

    /**
     * @return {MeldStore}
     */
    getMeldStore: function() {
        return this.meldStore;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.userId;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, RetrieveDialogueByUserIdForCurrentUserRequest)) {
            return (Obj.equals(value.getUserId(), this.userId));
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[RetrieveDialogueByUserIdForCurrentUserRequest]" +
                Obj.hashCode(this.userId));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Throwable} throwable
     * @param {CallResponse} callResponse
     */
    doProcessResponse: function(throwable, callResponse) {
        if (!throwable)  {
            var responseType    = callResponse.getType();
            var data            = callResponse.getData();
            if (responseType === ApiDefines.Responses.SUCCESS) {
                var objectId                    = data.objectId;
                var returnedMeldDocumentKey     = this.meldBuilder.generateMeldDocumentKey("Dialogue", objectId);
                var meldDocument                = this.meldStore.getMeldDocumentByMeldDocumentKey(returnedMeldDocumentKey);
                if (meldDocument) {
                    this.dialogueMemoryCache.setCache(this.userId, meldDocument.getData().id);
                    this.fireCallbacks(null, meldDocument);
                } else {
                    // NOTE BRN: Looks like this meld doc may have been removed before we could get our hands on it
                    this.fireCallbacks(new Exception("NotFound"));
                }
            } else if (responseType === ApiDefines.Responses.EXCEPTION) {
                //TODO BRN: Handle common exceptions
                this.fireCallbacks(data.exception);
            } else if (responseType === ApiDefines.Responses.ERROR) {
                //TODO BRN: Handle common errors
                this.fireCallbacks(data.error);
            } else {
                this.fireCallbacks(null, callResponse);
            }
        } else {
            this.fireCallbacks(throwable);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.RetrieveDialogueByUserIdForCurrentUserRequest', RetrieveDialogueByUserIdForCurrentUserRequest);
