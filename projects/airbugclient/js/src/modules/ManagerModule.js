//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ManagerModule')

//@Require('Class')
//@Require('List')
//@Require('Obj')
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
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');
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
                    var meldObj     = _this.get(meldKey);
                    callback(undefined, meldObj);
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
     * @param {function(Throwable, Set.<Meld>)=} callback
     */
    createEach: function(type, objects, filter, callback){
        var _this = this;
        var requestData = {objects: objects};
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        type = StringUtil.pluralize(type);
        this.airbugApi.request("create", type, requestData, function(error, callResponse) {
            if (!throwable) {
                if (callResponse.getType() === EntityDefines.Responses.SUCCESS) {
                    var data        = callResponse.getData();
                    var objectIds   = data.objectIds;
                    var meldKey     = _this.meldBuilder.generateMeldKey(type, objectId, filter);
                    var meldObj     = _this.get(meldKey);
                    callback(undefined, meldObj);
                } else if (callResponse.getType() === EntityDefines.Responses.EXCEPTION) {
                    //TODO BRN: Handle common exceptions
                } else if (callResponse.getType() === EntityDefines.Responses.ERROR) {
                    //TODO BRN: Handle common errors
                } else {
                    callback(undefined, callResponse);
                }
                var meldObjs = _this.getEach(type, data.objectIds, filter);
                callback(error, meldObjs);
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
        this.airbugApi.request(requestType, objectType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                callback(undefined, callResponse);
            }  else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} filter
     * @param {function(error, Meld)} callback
     */
    retrieve: function(type, id, filter, callback){
        var _this       = this;
        if (TypeUtil.isFunction(filter)) {
            callback = filter;
            filter = "basic";
        }
        var meldKey     = this.meldBuilder.generateMeldKey(type, id, filter);
        var meldObj     = this.get(meldKey);
        if (meldObj) {
            callback(null, meldObj);
        } else {
            var requestData = {objectId: id};
            _this.airbugApi.request("retrieve", type, requestData, function(error, data) {
                if (!error)  {
                    var returnedMeldKey = _this.meldBuilder.generateMeldKey(type, id, filter);
                    meldObj = _this.get(returnedMeldKey);
                    callback(undefined, meldObj);
                } else {
                    callback(error);
                }
            });
        }
    },

    /**
     * @param {string} type
     * @param {Array.<string>} ids
     * @param {string} filter
     * @param {function(error, Array.<meldbug.MeldObject>)} callback
     */
    retrieveEach: function(type, ids, filter, callback){
        var _this                   = this;
        var retrievedMeldObjects    = new List();
        var unretrievedMeldIds      = [];
        var meldKeys                = [];

        ids.forEach(function(id) {

            var meldObj = _this.get(meldId);
            if(meldObj){
                retrievedMeldObjects.push(meldObj);
            } else {
                unretrievedMeldIds.push(meldId);
            }
        });

        if (unretrievedMeldIds.length > 0) {
            var requestData = {objectIds: unretrievedMeldIds};
            var type = StringUtil.pluralize(type);
            this.airbugApi.request("retrieve", type, requestData, function(error, data){
                var extentMeldIds       = [];
                var destroyedMeldIds    = [];
                meldIds.forEach(function(meldId){
                    if(data[meldId]){
                        extentMeldIds.push(meldId);
                    } else {
                        destroyedMeldIds.push(meldId);
                    }
                });
                retrievedMeldObjects.concat(_this.getEach(extentMeldIds));
                callback(error, retrievedMeldObjects);
            })
        } else {
            callback(null, retrievedMeldObjects);
        }
    },

    /**
     * @param {string} type
     * @param {string} meldId
     * @param {{*}} changeObject
     * @param {function(error, meldbug.MeldObject)} callback
     */
    update: function(type, meldId, changeObject, callback){
        var requestData = {
            objectId: meldId,
            changeObject: changeObject
        };
        this.airbugApi.request("update", type, requestData, function(error, data){
            var objectId = data.objectId;
            if(objectId) {
                var obj = _this.get(objectId);
            } else {
                var obj = null;
            }
            callback(error, obj);
        });
    },

    /**
     * @param {string} type
     * @param {Array.<string>} meldIds
     * @param {{meldId: changeObject} changeObjects
     * @param {function(error, meldbug.MeldObject)} callback
     */
    updateEach: function(type, meldIds, changeObjects, callback){
        var _this = this;
        var requestData = {
            objectIds: meldIds,
            changeObjects: changeObjects
        };
        var type = StringUtil.pluralize(type);
        this.airbugApi.request("updateEach", type, requestData, function(error, data){
            var extentMeldIds       = [];
            var destroyedMeldIds    = [];
            meldIds.forEach(function(meldId){
                if(data[meldId]){
                    extentMeldIds.push(meldId);
                } else {
                    destroyedMeldIds.push(meldId);
                }
            });
            var updatedMeldObjects = _this.getEach(extentMeldIds);
            callback(error, updatedMeldObjects);
        });
    },

    /**
     * @param {string} type
     * @param {string} meldId
     * @param {function(error)} callback
     */
    destroy: function(type, meldId, callback){
        var requestData = {objectId: meldId};
        this.airbugApi.request("destroy", type, requestData, callback);
    },

    /**
     * @param {string} type
     * @param {Array.<string>} meldIds
     * @param {function(error)} callback
     */
    destroyEach: function(type, meldIds, callback){
        var requestData = {objectIds: meldIds};
        var type = StringUtil.pluralize(type);
        this.airbugApi.request("destroy", type, requestData, function(error, data){
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
            callback(error);
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
