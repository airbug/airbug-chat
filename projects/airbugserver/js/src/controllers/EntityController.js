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

//@Export('airbugserver.EntityController')

//@Require('Class')
//@Require('Exception')
//@Require('List')
//@Require('Map')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.ApiDefines')
//@Require('bugcontroller.Controller')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var List                = bugpack.require('List');
    var Map                 = bugpack.require('Map');
    var MappedThrowable     = bugpack.require('MappedThrowable');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');
    var ApiDefines          = bugpack.require('airbug.ApiDefines');
    var Controller          = bugpack.require('bugcontroller.Controller');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Controller}
     */
    var EntityController = Class.extend(Controller, {

        _name: "airbugserver.EntityController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ControllerManager} controllerManager
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {Marshaller} marshaller
         */
        _constructor: function(controllerManager, expressApp, bugCallRouter, marshaller) {

            this._super(controllerManager);


            //-------------------------------------------------------------------------------
            // Private Properties
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

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller                 = marshaller;
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

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
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
         * @param {Entity} entity
         * @param {function(Throwable=)} callback
         */
        processDeleteResponse: function(responder, throwable, entity, callback) {
            if (!throwable) {
                this.sendSuccessResponse(responder, {objectId: entity.getId()}, callback);
            } else {
                this.processThrowable(responder, throwable, callback);
            }
        },

        /**
         * @param {CallResponder} responder
         * @param {Throwable} throwable
         * @param {List.<string>} entityIdList
         * @param {function(Throwable=)} callback
         */
        processListResponse: function(responder, throwable, entityIdList, callback) {
            if (!throwable) {
                this.sendListSuccessResponse(responder, entityIdList, callback);
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
            if (entityIds) {
                entityIds.forEach(function(entityId) {
                    if (entityMap) {
                        var entity = entityMap.get(entityId);
                        if (!TypeUtil.isNull(entity) && !TypeUtil.isUndefined(entity)) {
                            dataMap.put(entityId, true);
                        } else {
                            dataMap.put(entityId, false);
                        }
                    } else {
                        dataMap.put(entityId, false);
                    }
                });
            }
            this.processMappedResponse(responder, throwable, dataMap, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {Throwable} throwable
         * @param {IList.<string>} entityList
         * @param {function(Throwable=)} callback
         */
        processRetrieveListResponse: function(responder, throwable, entityList, callback) {
            var dataList             = new List();
            if (entityList) {
                entityList.forEach(function(entity) {
                    if (entity) {
                        dataList.add(entity.getId());
                    }
                });
            }
            this.processListResponse(responder, throwable, dataList, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {Throwable} throwable
         * @param {Entity} entity
         * @param {function(Throwable=)} callback
         */
        processRetrieveResponse: function(responder, throwable, entity, callback) {
            if (!throwable) {
                this.sendSuccessResponse(responder, {objectId: entity.getId()}, callback);
            } else {
                this.processThrowable(responder, throwable, callback);
            }
        },

        /**
         * @param {CallResponder} responder
         * @param {Throwable} throwable
         * @param {Entity} entity
         * @param {function(Throwable=)} callback
         */
        processUpdateResponse: function(responder, throwable, entity, callback) {
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
        processResponse: function(responder, throwable, callback) {
            if (!throwable) {
                this.sendSuccessResponse(responder, {}, callback);
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


            var response = responder.response(ApiDefines.Responses.ERROR, {
                error: error
            });
            responder.sendResponse(response, callback);
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

            var response = responder.response(ApiDefines.Responses.EXCEPTION, {
                exception: exception
            });
            responder.sendResponse(response, callback);
        },
        /**
         *
         * @param {CallResponder} responder
         * @param {List.<string>} entityIdList
         * @param {function(Throwable=)} callback
         */
        sendListSuccessResponse: function(responder, entityIdList, callback) {
            var response = responder.response(ApiDefines.Responses.LIST_SUCCESS, {
                list: entityIdList
            });
            responder.sendResponse(response, callback);
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

            var response = responder.response(ApiDefines.Responses.MAPPED_EXCEPTION, {
                mappedException: mappedThrowable
            });
            responder.sendResponse(response, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {Map.<string, *>} map
         * @param {function(Throwable=)} callback
         */
        sendMappedSuccessResponse: function(responder, map, callback) {
            var response = responder.response(ApiDefines.Responses.MAPPED_SUCCESS, {
                map: map
            });
            responder.sendResponse(response, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {MappedThrowable} mappedThrowable
         * @param {Map.<string, *>} map
         * @param {function(Throwable=)} callback
         */
        sendMappedSuccessWithExceptionResponse: function(responder, mappedThrowable, map, callback) {
            var response = responder.response(ApiDefines.Responses.MAPPED_SUCCESS_WITH_EXCEPTION, {
                mappedException: mappedThrowable,
                map: map
            });
            responder.sendResponse(response, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {Object} data
         * @param {function(Throwable=)} callback
         */
        sendSuccessResponse: function(responder, data, callback) {
            console.log("EntityController#sendSuccessResponse");
            var response = responder.response(ApiDefines.Responses.SUCCESS, data);
            responder.sendResponse(response, callback);
        },

        /**
         * @param {CallResponder} responder
         * @param {Exception} exception
         * @param {Object} data
         * @param {function(Throwable=)} callback
         */
        sendSuccessWithExceptionResponse: function(responder, exception, data, callback) {
            var response = responder.response(ApiDefines.Responses.SUCCESS_WITH_EXCEPTION, {
                exception: exception,
                data: data
            });
            responder.sendResponse(response, callback);
        },


        //-------------------------------------------------------------------------------
        // Ajax Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Response} response
         * @param {Throwable} throwable
         * @param {Entity} entity
         */
        processAjaxCreateResponse: function(response, throwable, entity) {
            if (!throwable) {
                this.sendAjaxSuccessResponse(response, this.marshaller.marshalData(entity));
            } else {
                this.processAjaxThrowable(response, throwable);
            }
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Throwable} throwable
         * @param {Entity} entity
         */
        processAjaxDeleteResponse: function(response, throwable, entity) {
            if (!throwable) {
                this.sendAjaxSuccessResponse(response, {objectId: entity.getId()});
            } else {
                this.processAjaxThrowable(response, throwable);
            }
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Throwable} throwable
         * @param {Entity} entity
         */
        processAjaxRetrieveResponse: function(response, throwable, entity) {
            if (!throwable) {
                this.sendAjaxSuccessResponse(response, this.marshaller.marshalData(entity));
            } else {
                this.processAjaxThrowable(response, throwable);
            }
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Throwable} throwable
         * @param {Entity} entity
         */
        processAjaxUpdateResponse: function(response, throwable, entity) {
            if (!throwable) {
                this.sendAjaxSuccessResponse(response, this.marshaller.marshalData(entity));
            } else {
                this.processAjaxThrowable(response, throwable);
            }
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Throwable} throwable
         */
        processAjaxThrowable: function(response, throwable) {
            if (Class.doesExtend(throwable, Exception)) {
                if (throwable.getType() === "NotFound") {
                    this.sendAjaxNotFoundResponse(response, /** @type {Exception} */ (throwable));
                } else {
                    this.sendAjaxExceptionResponse(response, /** @type {Exception} */ (throwable));
                }
            } else {
                this.sendAjaxErrorResponse(response, throwable);
            }
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Error} error
         */
        sendAjaxErrorResponse: function(response, error) {
            //TEST
            console.log("Error occurred during request");
            console.log(error.message);
            console.log(error.stack);

            response.status(500);
            response.json({
                responseType: "Error",
                error: this.marshaller.marshalData(error)
            });
            response.end();
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Exception} exception
         */
        sendAjaxExceptionResponse: function(response, exception) {
            response.status(200);
            response.json({
                responseType: "Exception",
                exception: this.marshaller.marshalData(exception)
            });
            response.end();
        },

        /**
         * @protected
         * @param {Response} response
         * @param {Exception} exception
         */
        sendAjaxNotFoundResponse: function(response, exception) {
            response.status(404);
            response.json({
                responseType: "Exception",
                exception: this.marshaller.marshalData(exception)
            });
            response.end();
        },

        /**
         * @protected
         * @param {Response} response
         * @param {*=} data
         */
        sendAjaxSuccessResponse: function(response, data) {
            response.status(200);
            response.json({
                responseType: "Success",
                success: true,
                data: data
            });
            response.end();
        },

        /**
         * @protected
         * @param {Response} response
         * @param {string} url
         */
        sendRedirectResponse: function(response, url) {
            response.redirect(url);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.EntityController', EntityController);
});
