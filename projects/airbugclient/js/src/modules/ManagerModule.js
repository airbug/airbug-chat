//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ManagerModule')

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ManagerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {airbug.AirBugApi}                airbugApi
     * @param {meldbug.MeldObjectManager}       meldObjectManagerModule
     */
    _constructor: function(airbugApi, meldObjectManagerModule) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.AirbugApi}
         */
        this.airbugApi                          = airbugApi;

        /**
         * @private
         * @type {meldbug.MeldObjectManager}
         */
        this.meldObjectManagerModule            = meldObjectManagerModule;

    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {{*}} object
     * @param {function(error, meldbug.MeldObject)} callback
     */
    create: function(type, object, callback){
        var requestData = {object: object};
        this.airbugApi.request("create", type, requestData, function(error, data){
            var meldObj = _this.get(data.objectId);
            callback(error, meldObj);
        });
    },

    /**
     * @param {string} type
     * @param {Array.<{*}>} objects
     * @param {function(error, Array.<meldbug.MeldObject>)} callback
     */
    createEach: function(type, objects, callback){
        var _this = this;
        var requestData = {objects: objects};
        var type = StringUtil.pluralize(type);
        this.airbugApi.request("create", type, requestData, function(error, data){
            var meldObjs = _this.getEach(data.objectIds);
            callback(error, meldObjs);
        });    
    },

    /**
     * @param {string} requestType
     * @param {string} objectType
     * @param {{*}} requestData
     * @param {function(error, meldbug.MeldObject || Array.<meldbug.MeldObject>)} callback
     */
    request: function(requestType, objectType, requestData, callback){
        var _this = this;
        this.airbugApi.request(requestType, objectType, requestData, function(error, data){
            var objectId    = data.objectId;
            var objectIds   = data.objectIds;
            var returnData  = null;
            if(objectId){
                returnData = _this.get(data.objectId);
            } else if(objectIds){
                returnData = _this.getEach(data.objectIds);
            }
            callback(error, returnData);
        });
    },

    /**
     * @param {string} type
     * @param {string} meldId
     * @param {function(error, meldbug.MeldObject)} callback
     */
    retrieve: function(type, meldId, callback){
        var = _this = this;
        var meldObj = this.get(meldId);
        if(meldObj){
            callback(null, meldObj);
        } else {
            var requestData = {objectId: meldId};
            _this.airbugApi.request("retrieve", type, requestData, function(error, data){
                if(!error && data[meldId]) meldObj = _this.get(meldId);
                callback(error, meldObj);
            });
        }
    },

    /**
     * @param {string} type
     * @param {Array.<string>} meldIds
     * @param {function(error, Array.<meldbug.MeldObject>)} callback
     */
    retrieveEach: function(type, meldIds, callback){
        var _this                   = this;
        var retrievedMeldObjects    = [];
        var unretrievedMeldIds      = [];

        meldIds.forEach(function(meldId){
            var meldObj = _this.get(meldId);
            if(meldObj){
                retrievedMeldObjects.push(meldObj);
            } else {
                unretrievedMeldIds.push(meldId);
            }
        });

        if(unretrievedMeldIds.length > 0){
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
     * @param {string} meldId
     * @return {meldbug.MeldObject}
     */
    get: function(meldId){
        return this.meldObjectManagerModule.getMeldObject(meldId);
    },

    /**
     * @private
     * @param {Array.<string>} meldIds
     * @return {meldbug.MeldObject}
     */
    getEach: function(meldIds){
        return this.meldObjectManagerModule.getMeldObjects(meldIds);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ManagerModule", ManagerModule);
