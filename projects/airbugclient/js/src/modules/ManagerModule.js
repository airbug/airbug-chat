//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ManagerModule')

//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('airbug.EntityDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var StringUtil          = bugpack.require('StringUtil');
var TypeUtil            = bugpack.require('TypeUtil');
var EntityDefines       = bugpack.require('airbug.EntityDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {AirbugApi}       airbugApi
     * @param {MeldStore}       meldStore
     * @param {MeldBuilder}     meldBuilder
     */
    _constructor: function(airbugApi, meldStore, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi              = airbugApi;

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

    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {{*}} object
     * @param {string=} filter
     * @param {function(Throwable, Meld)=} callback
     */
    create: function(type, object, filter, callback) {
        var _this = this;
        var requestData = {object: object};
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        this.request("create", type, requestData, function(throwable, callResponse) {
            if (!throwable) {
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var data        = callResponse.getData();
                    var objectId    = data.objectId;
                    var meldKey     = _this.meldBuilder.generateMeldKey(type, objectId, filter);
                    var meldDocument  = _this.get(meldKey);
                    if (meldDocument) {
                        callback(undefined, meldDocument);
                    } else {
                        callback(new Error("Could not find MeldDocument after SUCCESS response. Something went wrong."));
                    }
                } else if (callResponse.getType() === EntityDefines.Responses.EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                } else if (callResponse.getType() === EntityDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                } else {
                    callback(undefined, callResponse);
                }
            } else {

                //TODO BRN: Handle common Throwables. These throwables should only come from

                callback(throwable);
            }
        });
    },

    /**
     * @param {string} type
     * @param {Array.<*>} objects
     * @param {string=} filter
     * @param {function(Throwable, Map.<MeldDocument>)=} callback
     */
    createEach: function(type, objects, filter, callback){
        var _this = this;
        var requestData = {objects: objects};
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        type = StringUtil.pluralize(type);
        this.request("create", type, requestData, function(throwable, callResponse) {
            if (!throwable) {

                //TODO BRN: Handle a partially successful response.
                var data            = callResponse.getData();
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var objectIds       = data.objectIds;
                    var meldDocumentSet   = new Set();
                    objectIds.forEach(function(objectId) {
                        var meldKey     = _this.meldBuilder.generateMeldKey(type, objectId, filter);
                        var meldDocument  = _this.get(meldKey);
                        meldDocumentSet.add(meldDocument);
                    });
                    callback(undefined, meldDocumentSet);
                } else if (callResponse.getType() === EntityDefines.Responses.EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                    callback(new Exception(data.exception));
                } else if (callResponse.getType() === EntityDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                    callback(new Error(data.error));
                } else {
                    callback(undefined, callResponse);
                }
            } else {
                callback(throwable);
            }
        });    
    },

    /**
     * @param {string} requestType
     * @param {string} objectType
     * @param {{*}} requestData
     * @param {function(Throwable, CallResponse} callback
     */
    request: function(requestType, objectType, requestData, callback){
        var _this = this;
        if(this.airbugApi.isNotConnected()) this.airbugApi.connect();
        this.airbugApi.request(requestType, objectType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                callback(undefined, callResponse);
            }  else {
                callback(throwable);
            }
        });
        //NOTE if unable to connect a FailedRequestException will be passed through
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} filter
     * @param {function(Throwable, Meld)} callback
     */
    retrieve: function(type, id, filter, callback){
        var _this       = this;
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        var meldKey     = this.meldBuilder.generateMeldKey(type, id, filter);
        var meldDocument  = this.get(meldKey);
        if (meldDocument) {
            callback(null, meldDocument);
        } else {
            var requestData = {objectId: id};
            _this.request("retrieve", type, requestData, function(throwable, callResponse) {
                if (!throwable)  {
                    var data            = callResponse.getData();
                    if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                        var objectId        = data.objectId;
                        var returnedMeldKey = _this.meldBuilder.generateMeldKey(type, objectId, filter);
                        meldDocument          = _this.get(returnedMeldKey);
                        callback(undefined, meldDocument);
                    } else if (callResponse.getType() === EntityDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                        callback(new Exception(data.exception));
                    } else if (callResponse.getType() === EntityDefines.Responses.ERROR) {
                        //TODO BRN: Handle common errors
                        callback(new Error(data.error));
                    } else {
                        callback(undefined, callResponse);
                    }
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @param {string} type
     * @param {Array.<string>} ids
     * @param {string} filter
     * @param {function(Throwable, Array.<meldbug.MeldDocument>)} callback
     */
    retrieveEach: function(type, ids, filter, callback){

        //TODO BRN: Fix this function, it's entirely broken.

        var _this       = this;
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        var retrievedMeldDocuments    = new List();
        var unretrievedMeldIds      = [];
        var meldKeys                = [];

        ids.forEach(function(id) {

            var meldDocument = _this.get(meldId);
            if (meldDocument) {
                retrievedMeldDocuments.push(meldDocument);
            } else {
                unretrievedMeldIds.push(meldId);
            }
        });

        if (unretrievedMeldIds.length > 0) {
            var requestData = {objectIds: unretrievedMeldIds};
            var type = StringUtil.pluralize(type);
            this.request("retrieve", type, requestData, function(throwable, data){
                var extentMeldIds       = [];
                var destroyedMeldIds    = [];
                meldIds.forEach(function(meldId){
                    if(data[meldId]){
                        extentMeldIds.push(meldId);
                    } else {
                        destroyedMeldIds.push(meldId);
                    }
                });
                retrievedMeldDocuments.concat(_this.getEach(extentMeldIds));
                callback(throwable, retrievedMeldDocuments);
            })
        } else {
            callback(null, retrievedMeldDocuments);
        }
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {{*}} changeObject
     * @param {string=} filter
     * @param {function(Throwable, meldbug.MeldDocument)=} callback
     */
    update: function(type, id, changeObject, filter, callback) {
        var _this = this;
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        var requestData = {
            objectId: id,
            changeObject: changeObject
        };
        this.airbugApi.request("update", type, requestData, function(throwable, callResponse) {
            if (!throwable)  {
                var data = callResponse.getData();
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var returnedMeldKey     = _this.meldBuilder.generateMeldKey(type, id, filter);
                    var meldDocument        = _this.get(returnedMeldKey);
                    callback(undefined);
                } else if (callResponse.getType() === EntityDefines.Responses.EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                    callback(new Exception(data.exception));
                } else if (callResponse.getType() === EntityDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                    callback(new Error(data.error));
                } else {
                    callback(undefined, callResponse);
                }
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} type
     * @param {Array.<string>} meldIds
     * @param {{meldId: changeObject} changeObjects
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    updateEach: function(type, meldIds, changeObjects, callback){
        var _this = this;
        var requestData = {
            objectIds: meldIds,
            changeObjects: changeObjects
        };
        var type = StringUtil.pluralize(type);
        this.airbugApi.request("updateEach", type, requestData, function(throwable, data){
            var extentMeldIds       = [];
            var destroyedMeldIds    = [];
            meldIds.forEach(function(meldId){
                if(data[meldId]){
                    extentMeldIds.push(meldId);
                } else {
                    destroyedMeldIds.push(meldId);
                }
            });
            var updatedMeldDocuments = _this.getEach(extentMeldIds);
            callback(throwable, updatedMeldDocuments);
        });
    },

    /**
     * @param {string} type
     * @param {string} meldId
     * @param {function(Throwable)} callback
     */
    destroy: function(type, meldId, callback){
        var requestData = {objectId: meldId};
        this.airbugApi.request("destroy", type, requestData, callback);
    },

    /**
     * @param {string} type
     * @param {Array.<string>} meldIds
     * @param {function(Throwable)} callback
     */
    destroyEach: function(type, meldIds, callback){
        var requestData = {objectIds: meldIds};
        var type = StringUtil.pluralize(type);
        this.airbugApi.request("destroy", type, requestData, function(throwable, data){
            //TODO
            // var destroyedMeldIds    = [];
            // var extentMeldIds       = [];
            // meldIds.forEach(function(meldId){
            //     if(data[meldId]){
            //         destroyedMeldIds.push(meldId);
            //     } else {
            //         extentMeldIds.push(meldId);
            //     }
            // });
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    get: function(meldKey){
        return this.meldStore.getMeld(meldKey);
    },

    /**
     * @private
     * @param {Array.<string>} meldKeys
     * @return {List.<Meld>}}
     */
    getEach: function(meldKeys){
        return this.meldStore.getEachMeld(meldKeys);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ManagerModule", ManagerModule);
