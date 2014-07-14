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

//@Export('airbugserver.AirbugClientRequestPublisher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Map')
//@Require('bugcall.CallRequestPublisher')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil                 = bugpack.require('ArgUtil');
    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var Flows                   = bugpack.require('Flows');
    var Map                     = bugpack.require('Map');
    var CallRequestPublisher    = bugpack.require('bugcall.CallRequestPublisher');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $iterableParallel       = Flows.$iterableParallel;
    var $parallel               = Flows.$parallel;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CallRequestPublisher}
     */
    var AirbugClientRequestPublisher = Class.extend(CallRequestPublisher, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {CallManager} callManager
         * @param {CallRequestManager} callRequestManager
         * @param {CallRequestFactory} callRequestFactory
         * @param {CallResponseHandlerFactory} callResponseHandlerFactory
         * @param {PubSub} pubSub
         * @param {AirbugCallManager} airbugCallManager
         */
        _constructor: function(logger, callManager, callRequestManager, callRequestFactory, callResponseHandlerFactory, pubSub, airbugCallManager) {

            this._super(logger, callManager, callRequestManager, callRequestFactory, callResponseHandlerFactory, pubSub);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugCallManager}
             */
            this.airbugCallManager              = airbugCallManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugCallManager}
         */
        getAirbugCallManager: function() {
            return this.airbugCallManager;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} sessionId
         * @param {string} requestType
         * @param {*} requestData
         * @param {(Collection.<string> | Array.<string>)}  excludedCallUuids
         * @param {function(Throwable, Map.<string, CallResponse>=)} callback
         */
        publishSessionRequest: function(sessionId, requestType, requestData, excludedCallUuids, callback) {
            var _this           = this;
            var callUuidSet     = null;
            var responseMap     = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.getCallUuidSetForSessionId(sessionId, function(throwable, returnedCallUuidSet) {
                        if (!throwable) {
                            callUuidSet = returnedCallUuidSet;
                            callUuidSet.removeAll(excludedCallUuids);
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.publishCallUuidSetRequest(callUuidSet, requestType, requestData, function(throwable, returnedResponseMap) {
                        if (!throwable) {
                            responseMap = returnedResponseMap;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, responseMap);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} userId
         * @param {string} requestType
         * @param {*} requestData
         * @param {function(MappedThrowable, Map.<string, CallResponse>=)} callback
         */
        publishUserRequest: function(userId, requestType, requestData, callback) {
            var _this           = this;
            var callUuidSet     = null;
            var responseMap     = null;
            $series([
                $task(function(flow) {
                    _this.airbugCallManager.getCallUuidSetForUserId(userId, function(throwable, returnedCallUuidSet) {
                        if (!throwable) {
                            callUuidSet = returnedCallUuidSet;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.publishCallUuidSetRequest(callUuidSet, requestType, requestData, function(throwable, returnedResponseMap) {
                        if (!throwable) {
                            responseMap = returnedResponseMap;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, responseMap);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {Set.<string>} callUuidSet
         * @param {string} requestType
         * @param {*} requestData
         * @param {function(MappedThrowable, Map.<string, CallResponse>=)} callback
         */
        publishCallUuidSetRequest: function(callUuidSet, requestType, requestData, callback) {
            var _this           = this;
            var responseMap     = new Map();
            $iterableParallel(callUuidSet, function(flow, callUuid) {
                var callResponseHandler = _this.factoryCallResponseHandler(function(throwable, callResponse) {
                    if (!throwable) {
                        responseMap.put(callUuid, callResponse);
                    }
                    flow.complete(throwable);
                });
                var callRequest = _this.factoryCallRequest(requestType, requestData);
                _this.publishCallRequest(callUuid, callRequest, callResponseHandler, function(throwable) {
                    if (throwable) {
                        flow.complete(throwable);
                    }
                });
            }).execute(function(mappedThrowable) {
                if (!mappedThrowable) {
                    callback(null, responseMap);
                } else {
                    callback(mappedThrowable);
                }
            })
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugClientRequestPublisher).with(
        module("airbugClientRequestPublisher")
            .args([
                arg().ref("logger"),
                arg().ref("callManager"),
                arg().ref("callRequestManager"),
                arg().ref("callRequestFactory"),
                arg().ref("callResponseHandlerFactory"),
                arg().ref("pubSub"),
                arg().ref("airbugCallManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugClientRequestPublisher', AirbugClientRequestPublisher);
});
