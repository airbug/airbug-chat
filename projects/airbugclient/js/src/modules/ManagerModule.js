//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ManagerModule')

//@Require('Class')
//@Require('Obj')


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
        var type = this.pluralize(type);
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
                var meldId = data.objectId;
                if(!error && meldId) meldObj = _this.get(meldId);
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
            var type = this.pluralize(type);
            this.airbugApi.request("retrieve", type, requestData, function(error, data){
                var meldIds = data.objectIds;
                if(!error){
                    if(meldIds){
                        retrievedMeldObjects.concat(_this.getEach(meldIds));
                        callback(null, retrievedMeldObjects);
                    } else {
                        callback(new Error("MeldIds were not returned on retrieval call to server. Some objects may be missing or may not exist"), retrievedMeldObjects);
                    }
                } else {
                    if(meldIds) retrievedMeldObjects.concat(_this.getEach(meldIds));
                    callback(error, retrievedMeldObjects);
                }
            })
        } else {
            callback(null, retrievedMeldObjects);
        }
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
    },

    /**
    * @private
    * @param {string} string
    * @return {string}
    */
    pluralize: function(string){
        //TODO also add irregular patterns
        var irregularPlurals = {};
        if(irregularPlurals[string]){
            return irregularPlurals[string]
        } else {
            return string + "s";
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ManagerModule", ManagerModule);
