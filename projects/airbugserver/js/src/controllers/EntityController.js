//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('EntityController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Exception   = bugpack.require('Exception');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EntityController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallResponder} responder
     * @param {(Error | Exception)} error
     */
    processError: function(responder, error) {
        if (Class.doesExtend(error, Exception)) {
            this.sendExceptionResponse(responder, error);
        } else {
            this.sendErrorResponse(responder, error);
        }
    },

    /**
     * @param {CallResponder} responder
     * @param {Error} error
     */
    sendErrorResponse: function(responder, error) {
        var response = responder.response("Error", {
            error: error
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Exception} exception
     */
    sendExceptionResponse: function(responder, exception) {
        var response = responder.response("Exception", {
            exception: exception.toObject()
        });
        responder.sendResponse(response);
    },

    /**
     * @param {CallResponder} responder
     * @param {Object} data
     */
    sendSuccessResponse: function(responder, data) {
        var response = responder.response("Success", data);
        responder.sendResponse(response);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.EntityController', EntityController);
