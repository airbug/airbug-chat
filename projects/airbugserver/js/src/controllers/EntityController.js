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

/**
 * @constructor
 * @extends {Obj}
 */
var EntityController = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     */
    _constructor: function(expressApp, bugCallRouter) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter              = bugCallRouter;

        /**
         * @private
         * @type {ExpressApp}
         */
        this.expressApp                 = expressApp;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @returns {BugCallRouter}
     */
    getBugCallRouter: function() {
        return this.bugCallRouter;
    },

    /**
     * @return {ExpressApp}
     */
    getExpressApp: function() {
        return this.expressApp;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallResponder} responder
     * @param {Throwable} throwable
     * @param {Entity} entity
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {ICollection.<string>} entityIds
     * @param {IMap.<string, Entity>} entityMap
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
     */
    sendMappedException: function(responder, mappedThrowable, callback) {

        //TODO BRN: If we are in production mode, we should not send across a full Exception.

        //TEST
        console.log("MappedException occurred on request");
        console.log(mappedThrowable.message);
        console.log(mappedThrowable.stack);

        var response = responder.response(EntityDefines.Responses.MAPPED_EXCEPTION, {
            mappedException: mappedThrowable.toObject()
        });
        responder.sendResponse(response);
        callback();
    },

    /**
     * @param {CallResponder} responder
     * @param {Map.<string, *>} map
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
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
     * @param {function(Throwable=)} callback
     */
    sendSuccessWithExceptionResponse: function(responder, exception, data, callback) {
        var response = responder.response(EntityDefines.Responses.SUCCESS_WITH_EXCEPTION, {
            exception: exception,
            data: data
        });
        responder.sendResponse(response);
        callback();
    },

    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable} throwable
     * @param {Response} response
     */
    processAjaxThrowable: function(throwable, response) {
        if (Class.doesExtend(throwable, Exception)) {
            if (throwable.getType() === "NotFound") {
                this.sendAjaxNotFoundResponse(/** @type {Exception} */ (throwable), response);
            } else {
                this.sendAjaxExceptionResponse(/** @type {Exception} */ (throwable), response);
            }
        } else {
            this.sendAjaxErrorResponse(throwable, response);
        }
    },

    /**
     * @private
     * @param {Error} error
     * @param {Response} response
     */
    sendAjaxErrorResponse: function(error, response) {
        //TEST
        console.log("Error occurred during request");
        console.log(error.message);
        console.log(error.stack);

        response.status(500);
        response.json({
            responseType: "Error",
            error: {
                message: error.message
            }
        });
    },

    /**
     * @private
     * @param {Exception} exception
     * @param {Response} response
     */
    sendAjaxExceptionResponse: function(exception, response) {
        response.status(200);
        response.json({
            responseType: "Exception",
            exception: {
                type: exception.getType(),
                data: exception.getData(),
                message: exception.getMessage()
            }
        });
    },

    /**
     * @private
     * @param {Exception} exception
     * @param {Response} response
     */
    sendAjaxNotFoundResponse: function(exception, response) {
        response.status(404);
        response.json({
            responseType: "Exception",
            exception: {
                type: exception.getType(),
                data: exception.getData(),
                message: exception.getMessage()
            }
        });
    },

    /**
     * @private
     * @param {Response} response
     */
    sendAjaxSuccessResponse: function(response) {
        response.status(200);
        response.json({
            responseType: "Success",
            success: true
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityController', EntityController);
