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
    processCreateResponse: function(responder, throwable, entity) {
        if (!throwable) {
            this.sendSuccessResponse(responder, {
                objectId: entity.getId()
            });
        } else {
            this.processThrowable(responder, throwable);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Map.<string, *>} map
     */
    processMappedResponse: function(responder, throwable, map) {
        if (throwable) {
            if (Class.doesExtend(throwable, MappedThrowable)) {
                if (map) {
                    this.sendMappedSuccessWithExceptionResponse(responder, throwable, map);
                } else {
                    this.sendMappedException(responder, throwable);
                }
            } else {
                this.processThrowable(responder, throwable);
            }
        } else {
            this.sendMappedSuccessResponse(responder, map);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Map.<string, Entity>} entityMap
     */
    processRetrieveEachResponse: function(responder, throwable, entityIds, entityMap) {
        var dataMap             = new Map();
        entityIds.forEach(function(entityId) {
            var entity = entityMap.get(entityId);
            if (!TypeUtil.isNull(entity) && !TypeUtil.isUndefined(entity)) {
                dataMap.put(entityId, true);
            } else {
                dataMap.put(entityId, false);
            }
        });
        this.processMappedResponse(responder, throwable, dataMap);
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     */
    processRetrieveResponse: function(responder, throwable) {
        if (!throwable) {
            this.sendSuccessResponse(responder, {});
        } else {
            this.processThrowable(responder, throwable);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     */
    processThrowable: function(responder, throwable) {
        if (Class.doesExtend(throwable, Exception)) {
            this.sendExceptionResponse(responder, throwable);
        } else {
            this.sendErrorResponse(responder, throwable);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Error} error
     */
    sendErrorResponse: function(responder, error) {

        //TODO BRN: If we are in production mode, we should not send across a full Error. Instead, we should simply
        // send an error response that the client should have a generic reaction to

        var response = responder.response(EntityDefines.Responses.ERROR, {
            error: error
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Exception} exception
     */
    sendExceptionResponse: function(responder, exception) {

        //TODO BRN: If we are in production mode, we should not send across a full Exception.

        var response = responder.response(EntityDefines.Responses.EXCEPTION, {
            exception: exception.toObject()
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {MappedThrowable} mappedThrowable
     */
    sendMappedException: function(responder, mappedThrowable) {

        //TODO BRN: If we are in production mode, we should not send across a full Exception.

        var response = responder.response(EntityDefines.Responses.EXCEPTION, {
            mappedException: mappedThrowable.toObject()
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Map.<string, *>} map
     */
    sendMappedSuccessResponse: function(responder, map) {
        var response = responder.response(EntityDefines.Responses.MAPPED_SUCCESS, {
            map: map.toObject()
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {MappedThrowable} mappedThrowable
     * @param {Map.<string, *>} map
     */
    sendMappedSuccessWithExceptionResponse: function(responder, mappedThrowable, map) {
        var response = responder.response(EntityDefines.Responses.MAPPED_SUCCESS_WITH_EXCEPTION, {
            mappedException: mappedThrowable.toObject(),
            map: map.toObject()
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Object} data
     */
    sendSuccessResponse: function(responder, data) {
        var response = responder.response(EntityDefines.Responses.SUCCESS, {
            data: data
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Exception} exception
     * @param {Object} data
     */
    sendSuccessWithExceptionResponse: function(responder, exception, data) {
        var response = responder.response(EntityDefines.Responses.SUCCESS_WITH_EXCEPTION, {
            exception: exception,
            data: data
        });
        responder.sendResponse(response);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityController', EntityController);
