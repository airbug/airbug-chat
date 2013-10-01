//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EntityController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('airbug.EntityDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Exception       = bugpack.require('Exception');
var Obj             = bugpack.require('Obj');
var EntityDefines   = bugpack.require('airbug.EntityDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

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
     * @param {Object} data
     */
    sendSuccessResponse: function(responder, data) {
        var response = responder.response(EntityDefines.Responses.SUCCESS, data);
        responder.sendResponse(response);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityController', EntityController);
