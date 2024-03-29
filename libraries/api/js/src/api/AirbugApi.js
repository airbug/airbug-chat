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

//@Export('airbug.AirbugApi')
//@Autoload

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Flows')
//@Require('List')
//@Require('airbug.ApiRequest')
//@Require('bugcall.CallClientEvent')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Flows                   = bugpack.require('Flows');
    var List                    = bugpack.require('List');
    var ApiRequest              = bugpack.require('airbug.ApiRequest');
    var CallClientEvent         = bugpack.require('bugcall.CallClientEvent');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var AirbugApi = Class.extend(EventDispatcher, {

        _name: "airbug.AirbugApi",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCallClient} bugCallClient
         */
        _constructor: function(bugCallClient) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BugCallClient}
             */
            this.bugCallClient      = bugCallClient;

            /**
             * @private
             * @type {List.<ApiRequest>}
             */
            this.currentRequestList = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BugCallClient}
         */
        getBugCallClient: function() {
            return this.bugCallClient;
        },

        /**
         * @return {List.<ApiRequest>}
         */
        getCurrentRequestList: function() {
            return this.currentRequestList;
        },

        /**
         * @return {string}
         */
        getCallUuid: function() {
            return this.bugCallClient.getCall().getCallUuid();
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            this.bugCallClient.removeEventPropagator(this);
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            this.bugCallClient.addEventPropagator(this);
            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} data
         * @param {function(Throwable=)} callback
         */
        connect: function(data, callback) {
            this.bugCallClient.openConnection(data, callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        disconnect: function(callback) {
            this.bugCallClient.closeConnection(callback);
        },

        /**
         * @param {function(Throwable=)} callback
         */
        refreshConnection: function(callback) {
            this.bugCallClient.refreshCall(callback);
        },

        /**
         * @param {string} requestType
         * @param {*} requestData
         * @param {function(Throwable, CallResponse=)} callback
         */
        sendRequest: function(requestType, requestData, callback) {
            var callRequest             = this.bugCallClient.factoryCallRequest(requestType, requestData);
            var callResponseHandler     = this.bugCallClient.factoryCallResponseHandler(callback);

            //NOTE BRN: The callback here just guarantees that the request was sent or queued. It is not the response.

            this.bugCallClient.sendRequest(callRequest, callResponseHandler, function(throwable, outgoingRequest) {

                // TODO BRN: We should check for timeouts and failed requests here. If those happen, we should setup this api
                // to listen for when the connection has been re-established. Once it has, we should retry all of the calls
                // that were in progress

                if (throwable) {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {ApiRequest} apiRequest
         * @param {function(Throwable, OutgoingRequest=)} callback
         */
        sendApiRequest: function(apiRequest, callback) {
            if (!apiRequest.isSent() && !this.currentRequestList.contains(apiRequest)) {
                this.addRequest(apiRequest);
                apiRequest.sendRequest(callback);
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {ApiRequest} apiRequest
         */
        addRequest: function(apiRequest) {
            apiRequest.setBugCallClient(this.bugCallClient);
            apiRequest.addEventListener(ApiRequest.EventTypes.REQUEST_COMPLETE, this.hearApiRequestComplete, this);
        },

        /**
         * @protected
         * @param {ApiRequest} apiRequest
         */
        removeRequest:function(apiRequest) {
            if (this.currentRequestList.contains(apiRequest)) {
                apiRequest.setBugCallClient(null);
                apiRequest.removeEventListener(ApiRequest.EventTypes.REQUEST_COMPLETE, this.hearApiRequestComplete, this);
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearApiRequestComplete: function(event) {
            var apiRequest = event.getTarget();
            this.removeRequest(apiRequest);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(AirbugApi, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugApi).with(
        module("airbugApi")
            .args([
                arg().ref("bugCallClient")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AirbugApi", AirbugApi);
});
