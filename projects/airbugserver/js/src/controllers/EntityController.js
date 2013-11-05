//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EntityController')

//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.EntityDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Map                 = bugpack.require('Map');
var MappedThrowable     = bugpack.require('MappedThrowable');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var EntityDefines       = bugpack.require('airbug.EntityDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Entity} entity
     */
    processCreateResponse: function(responder, throwable, entity, callback) {
        if (!throwable) {
            this.sendSuccessResponse(responder, {objectId: entity.getId()}, callback);
        } else {
            this.processThrowable(responder, throwable, callback);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Map.<string, *>} map
     */
    processMappedResponse: function(responder, throwable, map, callback) {
        if (throwable) {
            if (Class.doesExtend(throwable, MappedThrowable)) {
                if (map) {
                    this.sendMappedSuccessWithExceptionResponse(responder, throwable, map, callback);
                } else {
                    this.sendMappedException(responder, throwable, callback);
                }
            } else {
                this.processThrowable(responder, throwable, callback);
            }
        } else {
            this.sendMappedSuccessResponse(responder, map, callback);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Map.<string, Entity>} entityMap
     */
    processRetrieveEachResponse: function(responder, throwable, entityIds, entityMap, callback) {
        var dataMap             = new Map();
        entityIds.forEach(function(entityId) {
            var entity = entityMap.get(entityId);
            if (!TypeUtil.isNull(entity) && !TypeUtil.isUndefined(entity)) {
                dataMap.put(entityId, true);
            } else {
                dataMap.put(entityId, false);
            }
        });
        this.processMappedResponse(responder, throwable, dataMap, callback);
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Entity} entity
     * @param {function(Throwable)} callback
     */
    processRetrieveResponse: function(responder, throwable, entity, callback) {
        console.log("EntityController#processRetrieveResponse");
        if (!throwable) {
            this.sendSuccessResponse(responder, {objectId: entity.getId()}, callback);
        } else {
            this.processThrowable(responder, throwable, callback);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     */
    processThrowable: function(responder, throwable, callback) {
        console.log("EntityController#processThrowable");
        if (Class.doesExtend(throwable, Exception)) {
            this.sendExceptionResponse(responder, throwable, callback);
        } else {
            this.sendErrorResponse(responder, throwable, callback);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Error} error
     */
    sendErrorResponse: function(responder, error, callback) {

        //TODO BRN: If we are in production mode, we should not send across a full Error. Instead, we should simply
        // send an error response that the client should have a generic reaction to

        //TEST
        console.log("Error occurred on request");
        console.log(error.message);
        console.log(error.stack);


        var response = responder.response(EntityDefines.Responses.ERROR, {
            error: error
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {Exception} exception
     */
    sendExceptionResponse: function(responder, exception, callback) {

        //TODO BRN: If we are in production mode, we should not send across a full Exception.
        //TEST
        console.log("Exception occurred on request");
        console.log(exception.message);
        console.log(exception.stack);

        var response = responder.response(EntityDefines.Responses.EXCEPTION, {
            exception: exception.toObject()
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {MappedThrowable} mappedThrowable
     */
    sendMappedException: function(responder, mappedThrowable, callback) {

        //TODO BRN: If we are in production mode, we should not send across a full Exception.

        //TEST
        console.log("MappedException occurred on request");
        console.log(mappedThrowable.message);
        console.log(mappedThrowable.stack);

        var response = responder.response(EntityDefines.Responses.EXCEPTION, {
            mappedException: mappedThrowable.toObject()
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {Map.<string, *>} map
     */
    sendMappedSuccessResponse: function(responder, map, callback) {
        var response = responder.response(EntityDefines.Responses.MAPPED_SUCCESS, {
            map: map.toObject()
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {MappedThrowable} mappedThrowable
     * @param {Map.<string, *>} map
     */
    sendMappedSuccessWithExceptionResponse: function(responder, mappedThrowable, map, callback) {
        var response = responder.response(EntityDefines.Responses.MAPPED_SUCCESS_WITH_EXCEPTION, {
            mappedException: mappedThrowable.toObject(),
            map: map.toObject()
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {Object} data
     */
    sendSuccessResponse: function(responder, data, callback) {
        console.log("EntityController#sendSuccessResponse");
        var response = responder.response(EntityDefines.Responses.SUCCESS, data);
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {Exception} exception
     * @param {Object} data
     */
    sendSuccessWithExceptionResponse: function(responder, exception, data, callback) {
        var response = responder.response(EntityDefines.Responses.SUCCESS_WITH_EXCEPTION, {
            exception: exception,
            data: data
        });
        responder.sendResponse(response);
        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityController', EntityController);
