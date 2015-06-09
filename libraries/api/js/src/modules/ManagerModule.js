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

//@Export('airbug.ManagerModule')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('StringUtil')
//@Require('TypeUtil')
//@Require('airbug.ApiDefines')
//@Require('airbug.ApiRequest')
//@Require('airbug.RetrieveRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
    var ApiDefines          = bugpack.require('airbug.ApiDefines');
    var ApiRequest          = bugpack.require('airbug.ApiRequest');
    var RetrieveRequest     = bugpack.require('airbug.RetrieveRequest');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ManagerModule = Class.extend(Obj, {

        _name: "airbug.ManagerModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AirbugApi}       airbugApi
         * @param {MeldStore}       meldStore
         * @param {MeldBuilder}     meldBuilder
         */
        _constructor: function(airbugApi, meldStore, meldBuilder) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<ApiRequest, ApiRequest>}
             */
            this.activeApiRequestMap        = new Map();

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
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugApi}
         */
        getAirbugApi: function() {
            return this.airbugApi;
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
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} type
         * @param {Object} object
         * @param {function(Throwable, MeldDocument=)} callback
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
                    if (callResponse.getType() === ApiDefines.Responses.SUCCESS) {
                        var data        = callResponse.getData();
                        var objectId    = data.objectId;
                        var meldDocumentKey     = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                        var meldDocument  = _this.get(meldDocumentKey);
                        if (meldDocument) {
                            callback(null, meldDocument);
                        } else {
                            callback(new Error("Could not find MeldDocument after SUCCESS response. Something went wrong."));
                        }
                    } else if (callResponse.getType() === ApiDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                    } else if (callResponse.getType() === ApiDefines.Responses.ERROR) {
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
         * @param {function(Throwable, Map.<MeldDocument>=)} callback
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
                    if (callResponse.getType() === ApiDefines.Responses.SUCCESS) {
                        var objectIds       = data.objectIds;
                        var meldDocumentSet   = new Set();
                        objectIds.forEach(function(objectId) {
                            var meldDocumentKey     = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                            var meldDocument  = _this.get(meldDocumentKey);
                            meldDocumentSet.add(meldDocument);
                        });
                        callback(undefined, meldDocumentSet);
                    } else if (callResponse.getType() === ApiDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                        callback(data.exception);
                    } else if (callResponse.getType() === ApiDefines.Responses.ERROR) {
                        //TODO BRN: Handle common errors
                        callback(data.error);
                    } else {
                        callback(null, callResponse);
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
            this.airbugApi.sendRequest(requestType, requestData, function(throwable, callResponse) {
                if (!throwable) {
                    callback(null, callResponse);
                }  else {
                    callback(throwable);
                }
            });
            //NOTE if unable to connect a bugcall.RequestFailedException will be passed through
        },

        /**
         * @param {string} entityType
         * @param {string} entityId
         * @param {function(Throwable, MeldDocument=)} callback
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

            var meldDocumentKey         = this.meldBuilder.generateMeldDocumentKey(entityType, entityId);
            var meldDocument            = this.meldStore.getMeldDocumentByMeldDocumentKey(meldDocumentKey);
            if (meldDocument) {
               callback(null, meldDocument);
            } else {
                var request = this.generateRetrieveRequest(entityType, entityId);
                request.addCallback(callback);
                this.airbugApi.sendApiRequest(request, function(throwable, outgoingRequest) {
                    if (throwable) {
                        callback(throwable);
                    }
                });
            }
        },

        /**
         * @param {string} type
         * @param {Array.<string>} ids
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
         */
        retrieveEach: function(type, ids, callback) {
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
                var meldDocumentKey         = _this.meldBuilder.generateMeldDocumentKey(type, id);
                var meldDocument    = _this.get(meldDocumentKey);
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
                callback(null, retrievedMeldMap);
            }
        },

        /**
         * @param {string} type
         * @param {string} id
         * @param {*} updateObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        update: function(type, id, updateObject, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "type", optional: false, type: "string"},
                {name: "id", optional: false, type: "string"},
                {name: "updateObject", optional: false, type: "object"},
                {name: "callback", optional: false, type: "function"}
            ]);
            type            = args.type;
            id              = args.id;
            updateObject    = args.updateObject;
            callback        = args.callback;

            var _this = this;
            var requestData = {
                objectId: id,
                updateObject: updateObject
            };
            var requestType = "update" + type;
            this.airbugApi.sendRequest(requestType, requestData, function(throwable, callResponse) {
                if (!throwable)  {
                    var data = callResponse.getData();
                    if (callResponse.getType() === ApiDefines.Responses.SUCCESS) {
                        var returnedMeldDocumentKey     = _this.meldBuilder.generateMeldDocumentKey(type, id);
                        var meldDocument        = _this.get(returnedMeldDocumentKey);
                        callback(null, meldDocument);
                    } else if (callResponse.getType() === ApiDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                        callback(data.exception);
                    } else if (callResponse.getType() === ApiDefines.Responses.ERROR) {
                        //TODO BRN: Handle common errors
                        callback(data.error);
                    } else {
                        callback(null, callResponse);
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
         * @param {function(Throwable, List.<MeldDocument>=)} callback
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
            this.airbugApi.sendRequest(requestType, requestData, function(throwable, data) {
                var extentMeldDocumentKeys      = [];
                var destroyedMeldDocumentKeys    = [];
                ids.forEach(function(id) {
                    var meldDocumentKey = _this.meldBuilder.generateMeldDocumentKey(type, id);
                    if (data.objectIds[id]) {
                        extentMeldDocumentKeys.push(meldDocumentKey);
                    } else {
                        destroyedMeldDocumentKeys.push(meldDocumentKey);
                    }
                });
                var updatedMeldDocuments = _this.getEach(extentMeldDocumentKeys);
                callback(throwable, updatedMeldDocuments);
            });
        },

        /**
         * @param {string} entityType
         * @param {string} entityId
         * @param {function(Throwable=)} callback
         */
        delete: function(entityType, entityId, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "entityType", optional: false, type: "string"},
                {name: "entityId", optional: false, type: "string"},
                {name: "callback", optional: false, type: "function"}
            ]);
            entityType  = args.entityType;
            entityId    = args.entityId;
            callback    = args.callback;

            var requestData = {objectId: entityId};
            var requestType = "delete" + entityType;
            this.airbugApi.sendRequest(requestType, requestData, callback);
        },

        /**
         * @param {string} type
         * @param {Array.<string>} ids
         * @param {function(Throwable=)} callback
         */
        destroyEach: function(type, ids, callback) {
            //TODO
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {ApiRequest} request
         */
        addActiveApiRequest: function(request) {
            request.addEventListener(ApiRequest.EventTypes.PROCESSING_RESPONSE, this.hearApiRequestProcessingResponse, this);
            this.activeApiRequestMap.put(request, request);
        },

        /**
         * @protected
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {MeldDocument}
         */
        get: function(meldDocumentKey) {
            return this.meldStore.getMeldDocumentByMeldDocumentKey(meldDocumentKey);
        },

        /**
         * @protected
         * @param {ApiRequest} apiRequest
         * @return {ApiRequest}
         */
        getActiveApiRequest: function(apiRequest) {
            return this.activeApiRequestMap.get(apiRequest);
        },

        /**
         * @protected
         * @param {Array.<string>} meldDocumentKeys
         * @return {List.<MeldDocument>}
         */
        getEach: function(meldDocumentKeys) {
            return this.meldStore.getEachMeldDocumentByMeldDocumentKey(meldDocumentKeys);
        },

        /**
         * @protected
         * @param {ApiRequest} apiRequest
         * @return {boolean}
         */
        hasActiveApiRequest: function(apiRequest) {
            return this.activeApiRequestMap.containsKey(apiRequest);
        },

        /**
         * @protected
         * @param {Throwable} throwable
         * @param {CallResponse} callResponse
         * @param {string} type
         * @param {function(Throwable, List.<MeldDocument>=)} callback
         */
        processListRetrieveResponse: function(throwable, callResponse, type, callback) {
            var _this               = this;
            var retrievedMeldList   = new List();
            var dataList            = null;
            if (!throwable) {
                var responseType    = callResponse.getType();
                var data            = callResponse.getData();
                if (responseType === ApiDefines.Responses.LIST_SUCCESS) {
                    dataList     = data.list;
                    dataList.forEach(function(objectId) {
                        var returnedMeldDocumentKey = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                        var meldDocument    = _this.get(returnedMeldDocumentKey);
                        if (meldDocument) {
                            retrievedMeldList.add(meldDocument);
                        }
                    });
                    callback(null, retrievedMeldList);
                } else if (responseType === ApiDefines.Responses.EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                    callback(data.exception);
                } else if (responseType === ApiDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                    callback(data.error);
                } else {
                    callback(null, callResponse);
                }
            } else {
                callback(throwable);
            }
        },

        /**
         * @protected
         * @param {Throwable} throwable
         * @param {CallResponse} callResponse
         * @param {(Map.<string, MeldDocument> | function(Throwable, Map.<string, MeldDocument>=))} retrievedMeldMap
         * @param {string} type
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
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
                if (responseType === ApiDefines.Responses.MAPPED_SUCCESS) {
                    var dataMap     = data.map;
                    dataMap.forEach(function(success, objectId) {
                        if (success) {
                            var returnedMeldDocumentKey = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                            var meldDocument    = _this.get(returnedMeldDocumentKey);
                            retrievedMeldMap.put(objectId, meldDocument);
                        } else {
                            retrievedMeldMap.put(objectId, null);
                        }
                    });
                    callback(undefined, retrievedMeldMap);
                } else if (responseType === ApiDefines.Responses.MAPPED_SUCCESS_WITH_EXCEPTION) {
                    var dataMap     = data.map;
                    dataMap.forEach(function(success, objectId) {
                        if (success) {
                            var returnedMeldDocumentKey = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                            var meldDocument    = _this.get(returnedMeldDocumentKey);
                            retrievedMeldMap.put(objectId, meldDocument);
                        } else {
                            retrievedMeldMap.put(objectId, null);
                        }
                    });
                    callback(data.mappedException, retrievedMeldMap);
                } else if (responseType === ApiDefines.Responses.MAPPED_EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                    callback(data.mappedException);
                } else if (responseType === ApiDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                    callback(data.error);
                } else {
                    callback(undefined, callResponse);
                }
            } else {
                callback(throwable);
            }
        },

        /**
         * @protected
         * @param {ApiRequest} request
         */
        removeActiveApiRequest: function(request) {
            request.removeEventListener(ApiRequest.EventTypes.PROCESSING_RESPONSE, this.hearApiRequestProcessingResponse, this);
            this.activeApiRequestMap.remove(request);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} entityType
         * @param {string} entityId
         * @param {MeldBuilder} meldBuilder
         * @param {MeldStore} meldStore
         * @return {RetrieveRequest}
         */
        factoryRetrieveRequest: function(entityType, entityId, meldBuilder, meldStore) {
            return new RetrieveRequest(entityType, entityId, meldBuilder, meldStore);
        },

        /**
         * @private
         * @param {string} entityType
         * @param {string} entityId
         * @return {RetrieveRequest}
         */
        generateRetrieveRequest: function(entityType, entityId) {
            var apiRequest = this.factoryRetrieveRequest(entityType, entityId, this.meldBuilder, this.meldStore);
            if (this.hasActiveApiRequest(apiRequest)) {
                return /** @type {RetrieveRequest} */ (this.getActiveApiRequest(apiRequest));
            } else {
                this.addActiveApiRequest(apiRequest);
                return apiRequest;
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearApiRequestProcessingResponse: function(event) {
            var request = event.getTarget();
            this.removeActiveApiRequest(request);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ManagerModule", ManagerModule);
});
