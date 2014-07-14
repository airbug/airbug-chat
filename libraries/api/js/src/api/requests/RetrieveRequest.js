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

//@Export('airbug.RetrieveRequest')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbug.ApiDefines')
//@Require('airbug.ApiRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var Obj         = bugpack.require('Obj');
    var ApiDefines  = bugpack.require('airbug.ApiDefines');
    var ApiRequest  = bugpack.require('airbug.ApiRequest');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApiRequest}
     */
    var RetrieveRequest = Class.extend(ApiRequest, {

        _name: "airbug.RetrieveRequest",


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
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, RetrieveRequest)) {
                return (Obj.equals(value.getEntityType(), this.entityType) && Obj.equals(value.getEntityId(), this.entityId));
            }
            return false;
        },

        /**
         * @override
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[RetrieveRequest]" +
                    Obj.hashCode(this.entityType) + "_" +
                    Obj.hashCode(this.entityId));
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
                    var returnedMeldDocumentKey     = this.meldBuilder.generateMeldDocumentKey(this.entityType, objectId);
                    var meldDocument                = this.meldStore.getMeldDocumentByMeldDocumentKey(returnedMeldDocumentKey);
                    if (meldDocument) {
                        this.fireCallbacks(null, meldDocument);
                    } else {
                        // NOTE BRN: Looks like this meld doc may have been removed before we could get our hands on it
                        this.fireCallbacks(new Exception("NotFound", {}, "Could not find MeldDocument with the MeldDocumentKey '" + returnedMeldDocumentKey.toStringKey() + "'"));
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

    bugpack.export('airbug.RetrieveRequest', RetrieveRequest);
});
