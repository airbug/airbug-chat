//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RetrieveRequest')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('airbug.ApiRequest')
//@Require('airbug.EntityDefines')


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
var ApiRequest              = bugpack.require('airbug.ApiRequest');
var EntityDefines           = bugpack.require('airbug.EntityDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RetrieveRequest = Class.extend(ApiRequest, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} entityType
     * @param {string} entityId
     * @param {MeldBuilder} meldBuilder
     * @param {MeldStore} meldStore
     */
    _constructor: function(entityType, entityId, meldBuilder, meldStore) {
        var requestType = "retrieve" + entityType;
        var requestData = {
            objectId: entityId
        };
        this._super(requestType, requestData);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.entityId       = entityId;

        /**
         * @private
         * @type {string}
         */
        this.entityType     = entityType;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder    = meldBuilder;

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore      = meldStore;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getEntityId: function() {
        return this.entityId;
    },

    /**
     * @return {string}
     */
    getEntityType: function() {
        return this.entityType;
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
            if (responseType === EntityDefines.Responses.SUCCESS) {
                var objectId                    = data.objectId;
                var returnedMeldDocumentKey     = this.meldBuilder.generateMeldDocumentKey(this.entityType, objectId);
                var meldDocument                = this.meldStore.getMeldDocumentByMeldDocumentKey(returnedMeldDocumentKey);
                if (meldDocument) {
                    this.fireCallbacks(null, meldDocument);
                } else {
                    // NOTE BRN: Looks like this meld doc may have been removed before we could get our hands on it
                    this.fireCallbacks(new Exception("NotFound"));
                }
            } else if (responseType === EntityDefines.Responses.EXCEPTION) {
                //TODO BRN: Handle common exceptions
                this.fireCallbacks(new Exception(data.exception.type, data.exception.data, data.exception.message, data.exception.causes));
            } else if (responseType === EntityDefines.Responses.ERROR) {
                //TODO BRN: Handle common errors
                this.fireCallbacks(new Bug(data.error.type, data.error.data, data.error.message));
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

bugpack.export('airbug.RetrieveRequest', RetrieveRequest);
