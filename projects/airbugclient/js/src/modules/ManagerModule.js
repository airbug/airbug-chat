//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ManagerModule')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('airbug.ApiRequest')
//@Require('airbug.EntityDefines')
//@Require('airbug.RetrieveRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var StringUtil          = bugpack.require('StringUtil');
var TypeUtil            = bugpack.require('TypeUtil');
var ApiRequest          = bugpack.require('airbug.ApiRequest');
var EntityDefines       = bugpack.require('airbug.EntityDefines');
var RetrieveRequest     = bugpack.require('airbug.RetrieveRequest');


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
         * @type {Map.<string, RetrieveRequest>}
         */
        this.activeRetrieveRequestMap   = new Map();

        /**
         * @private
         * @type {AirbugApi}
         */
        this.airbugApi                  = airbugApi;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                = meldBuilder;

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore                  = meldStore;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {Object} object
     * @param {function(Throwable, Meld)} callback
     */
    create: function(type, object, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "type", optional: false, type: "string"},
            {name: "object", optional: false, type: "object"},
            {name: "callback", optional: false, type: "function"}
        ]);
        type        = args.type;
        object      = args.object;
        callback    = args.callback;

        var _this = this;
        var requestData = {object: object};
        var requestType = "create" + type;
        this.request(requestType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var data        = callResponse.getData();
                    var objectId    = data.objectId;
                    var meldKey     = _this.meldBuilder.generateMeldKey(type, objectId);
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
     * @param {function(Throwable, Map.<MeldDocument>)} callback
     */
    createEach: function(type, objects, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "type", optional: false, type: "string"},
            {name: "objects", optional: false, type: "array"},
            {name: "callback", optional: false, type: "function"}
        ]);
        type        = args.type;
        objects     = args.objects;
        callback    = args.callback;

        var _this = this;
        var requestData = {objects: objects};
        var requestType = "create" + StringUtil.pluralize(type);
        this.request(requestType, requestData, function(throwable, callResponse) {
            if (!throwable) {

                //TODO BRN: Handle a partially successful response.
                var data            = callResponse.getData();
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var objectIds       = data.objectIds;
                    var meldDocumentSet   = new Set();
                    objectIds.forEach(function(objectId) {
                        var meldKey     = _this.meldBuilder.generateMeldKey(type, objectId);
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
     * @param {*} requestData
     * @param {function(Throwable, CallResponse=)} callback
     */
    request: function(requestType, requestData, callback) {
        this.airbugApi.request(requestType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                callback(undefined, callResponse);
            }  else {
                callback(throwable);
            }
        });
        //NOTE if unable to connect a bugcall.RequestFailedException will be passed through
    },

    /**
     * @param {string} entityType
     * @param {string} entityId
     * @param {function(Throwable, Meld)} callback
     */
    retrieve: function(entityType, entityId, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "entityType", optional: false, type: "string"},
            {name: "entityId", optional: false, type: "string"},
            {name: "callback", optional: false, type: "function"}
        ]);
        entityType  = args.entityType;
        entityId    = args.entityId;
        callback    = args.callback;

        var meldKey         = this.meldBuilder.generateMeldKey(entityType, entityId);
        var meldDocument    = this.meldStore.getMeld(meldKey);
        if (meldDocument) {
           callback(null, meldDocument);
        } else {
            var request = this.generateRetrieveRequest(entityType, entityId);
            request.addCallback(callback);
            this.airbugApi.sendRequest(request);
        }
    },

    /**
     * @param {string} type
     * @param {Array.<string>} ids
     * @param {function(Throwable, Map.<string, Meld>)} callback
     */
    retrieveEach: function(type, ids, filter, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "type", optional: false, type: "string"},
            {name: "ids", optional: false, type: "array"},
            {name: "callback", optional: false, type: "function"}
        ]);
        type        = args.type;
        ids         = args.ids;
        callback    = args.callback;

        var _this       = this;
        var retrievedMeldMap   = new Map();
        var unretrievedIds     = [];

        ids.forEach(function(id) {
            var meldKey         = _this.meldBuilder.generateMeldKey(type, id);
            var meldDocument    = _this.get(meldKey);
            if (meldDocument) {
                retrievedMeldMap.put(id, meldDocument);
            } else {
                unretrievedIds.push(id);
            }
        });

        if (unretrievedIds.length > 0) {
            var requestData = {objectIds: unretrievedIds};
            var requestType = "retrieve" + StringUtil.pluralize(type);
            this.request(requestType, requestData, function(throwable, callResponse) {
                _this.processMappedRetrieveResponse(throwable, callResponse, retrievedMeldMap, type, callback);
            });
        } else {
            callback(undefined, retrievedMeldMap);
        }
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {*} changeObject
     * @param {function(Throwable, Meld)} callback
     */
    update: function(type, id, changeObject, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "type", optional: false, type: "string"},
            {name: "id", optional: false, type: "string"},
            {name: "changeObject", optional: false, type: "object"},
            {name: "callback", optional: false, type: "function"}
        ]);
        type            = args.type;
        id              = args.id;
        changeObject    = args.changeObject;
        callback        = args.callback;

        var _this = this;
        var requestData = {
            objectId: id,
            changeObject: changeObject
        };
        var requestType = "update" + type;
        this.airbugApi.request(requestType, requestData, function(throwable, callResponse) {
            if (!throwable)  {
                var data = callResponse.getData();
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var returnedMeldKey     = _this.meldBuilder.generateMeldKey(type, id);
                    var meldDocument        = _this.get(returnedMeldKey);
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
    },

    /**
     * @param {string} type
     * @param {Array.<string>} ids
     * @param {Array.<Object>} changeObjects
     * @param {function(Throwable, List.<Meld>=)} callback
     */
    updateEach: function(type, ids, changeObjects, callback) {
        var args = ArgUtil.process(arguments, [
            {name: "type", optional: false, type: "string"},
            {name: "ids", optional: false, type: "arrat"},
            {name: "changeObjects", optional: false, type: "array"},
            {name: "callback", optional: false, type: "function"}
        ]);
        type            = args.type;
        ids             = args.ids;
        changeObjects   = args.changeObjects;
        callback        = args.callback;

        var _this = this;
        var requestData = {
            objectIds: ids,
            changeObjects: changeObjects
        };
        var requestType = "update" + StringUtil.pluralize(type);
        this.airbugApi.request(requestType, requestData, function(throwable, data) {
            var extentMeldKeys      = [];
            var destroyedMeldKeys    = [];
            ids.forEach(function(id) {
                var meldKey = _this.meldBuilder.generateMeldKey(type, id);
                if (data.objectIds[id]) {
                    extentMeldKeys.push(meldKey);
                } else {
                    destroyedMeldKeys.push(meldKey);
                }
            });
            var updatedMeldDocuments = _this.getEach(extentMeldKeys);
            callback(throwable, updatedMeldDocuments);
        });
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {function(Throwable)} callback
     */
    destroy: function(type, id, callback) {
        //TODO
    },

    /**
     * @param {string} type
     * @param {Array.<string>} ids
     * @param {function(Throwable)} callback
     */
    destroyEach: function(type, ids, callback) {
        //TODO
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {RetrieveRequest} request
     */
    addRetrieveRequest: function(request) {
        var key = this.generateRetrieveRequestKey(request.getEntityType(), request.getEntityId());
        request.addEventListener(ApiRequest.EventTypes.PROCESSING_RESPONSE, this.hearApiRetrieveRequestProcessingResponse, this);
        this.activeRetrieveRequestMap.put(key, request);
    },

    /**
     * @private
     * @param entityType
     * @param entityId
     * @returns {RetrieveRequest}
     */
    generateRetrieveRequest: function(entityType, entityId) {
        var key = this.generateRetrieveRequestKey(entityType, entityId);

        //TEST
        console.log("ManagerModule#generateRetrieveRequest - entityType:", entityType, " entityId:", entityId);

        //TEST
        console.log("this.activeRetrieveRequestMap.containsKey(key):", this.activeRetrieveRequestMap.containsKey(key));


        if (this.activeRetrieveRequestMap.containsKey(key)) {
            return this.activeRetrieveRequestMap.get(key);
        } else {
            var request = new RetrieveRequest(entityType, entityId, this.meldBuilder, this.meldStore);
            this.addRetrieveRequest(request);
            return request;
        }
    },

    /**
     * @private
     * @param {string} entityType
     * @param {string} entityId
     * @returns {string}
     */
    generateRetrieveRequestKey: function(entityType, entityId) {
        return entityType + "_" + entityId;
    },

    /**
     * @private
     * @param {RetrieveRequest} request
     */
    removeRetrieveRequest: function(request) {
        var key = this.generateRetrieveRequestKey(request.getEntityType(), request.getEntityId());
        request.removeEventListener(ApiRequest.EventTypes.PROCESSING_RESPONSE, this.hearApiRetrieveRequestProcessingResponse, this);
        this.activeRetrieveRequestMap.remove(key);
    },

    /**
     * @private
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    get: function(meldKey) {
        return this.meldStore.getMeld(meldKey);
    },

    /**
     * @private
     * @param {Array.<string>} meldKeys
     * @return {List.<Meld>}
     */
    getEach: function(meldKeys) {
        return this.meldStore.getEachMeld(meldKeys);
    },


    /**
     * @private
     * @param {Throwable} throwable
     * @param {CallResponse} callResponse
     * @param {(Map.<string, Meld> | function(Throwable, Map.<string, Meld>=))} retrievedMeldMap
     * @param {string} type
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    processMappedRetrieveResponse: function(throwable, callResponse, retrievedMeldMap, type, callback) {
        if (TypeUtil.isFunction(retrievedMeldMap)) {
            callback = retrievedMeldMap;
            retrievedMeldMap = new Map();
        }
        var _this = this;
        if (!throwable) {
            var responseType    = callResponse.getType();
            var data            = callResponse.getData();
            if (responseType === EntityDefines.Responses.MAPPED_SUCCESS) {
                var dataMap     = data.map;
                Obj.forIn(dataMap, function(objectId, success) {
                    if (success) {
                        var returnedMeldKey = _this.meldBuilder.generateMeldKey(type, objectId);
                        var meldDocument    = _this.get(returnedMeldKey);
                        retrievedMeldMap.put(objectId, meldDocument);
                    } else {
                        retrievedMeldMap.put(objectId, null);
                    }
                });
                callback(undefined, retrievedMeldMap);
            } else if (responseType === EntityDefines.Responses.MAPPED_SUCCESS_WITH_EXCEPTION) {
                var dataMap     = data.map;
                Obj.forIn(dataMap, function(objectId, success) {
                    if (success) {
                        var returnedMeldKey = _this.meldBuilder.generateMeldKey(type, objectId);
                        var meldDocument    = _this.get(returnedMeldKey);
                        retrievedMeldMap.put(objectId, meldDocument);
                    } else {
                        retrievedMeldMap.put(objectId, null);
                    }
                });
                callback(new Exception(data.mappedException), retrievedMeldMap);
            } else if (responseType === EntityDefines.Responses.MAPPED_EXCEPTION) {
                //TODO BRN: Handle common exceptions
                callback(new Exception(data.mappedException));
            } else if (responseType === EntityDefines.Responses.ERROR) {
                //TODO BRN: Handle common errors
                callback(new Error(data.error));
            } else {
                callback(undefined, callResponse);
            }
        } else {
            callback(throwable);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearApiRetrieveRequestProcessingResponse: function(event) {
        var request = event.getTarget();
        this.removeRetrieveRequest(request);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ManagerModule", ManagerModule);
