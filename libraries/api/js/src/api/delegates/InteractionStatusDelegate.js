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

//@Export('airbug.InteractionStatusDelegate')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('airbug.ApiDefines')
//@Require('airbug.SetInteractionStatusRequest')
//@Require('bugcall.CallEvent')
//@Require('bugcall.RequestFailedException')
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

    var Bug                             = bugpack.require('Bug');
    var Class                           = bugpack.require('Class');
    var Exception                       = bugpack.require('Exception');
    var Flows                           = bugpack.require('Flows');
    var Obj                             = bugpack.require('Obj');
    var SetInteractionStatusRequest     = bugpack.require('airbug.SetInteractionStatusRequest');
    var CallEvent                       = bugpack.require('bugcall.CallEvent');
    var RequestFailedException          = bugpack.require('bugcall.RequestFailedException');
    var ArgTag                          = bugpack.require('bugioc.ArgTag');
    var ModuleTag                       = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var InteractionStatusDelegate = Class.extend(Obj, {

        _name: "airbug.InteractionStatusDelegate",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {AirbugApi} airbugApi
         * @param {Logger} logger
         */
        _constructor: function(airbugApi, logger) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {InteractionStatusDefines.Status}
             */
            this.acknowledgedStatus     = null;

            /**
             * @private
             * @type {AirbugApi}
             */
            this.airbugApi              = airbugApi;

            /**
             * @private
             * @type {SetInteractionStatusRequest}
             */
            this.currentRequest         = null;

            /**
             * @private
             * @type {InteractionStatusDefines.Status}
             */
            this.desiredStatus          = null;

            /**
             * @private
             * @type {boolean}
             */
            this.listeningForReconnect  = false;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                 = logger;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {InteractionStatusDefines.Status}
         */
        getAcknowledgedStatus: function() {
            return this.acknowledgedStatus;
        },

        /**
         * @return {AirbugApi}
         */
        getAirbugApi: function() {
            return this.airbugApi;
        },

        /**
         * @return {SetInteractionStatusRequest}
         */
        getCurrentRequest: function() {
            return this.currentRequest;
        },

        /**
         * @return {InteractionStatusDefines.Status}
         */
        getDesiredStatus: function() {
            return this.desiredStatus;
        },

        /**
         * @return {boolean}
         */
        isListeningForReconnect: function() {
            return this.listeningForReconnect;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {InteractionStatusDefines.Status} interactionStatus
         */
        setInteractionStatus: function(interactionStatus) {
            if (this.desiredStatus !== interactionStatus) {
                this.desiredStatus = interactionStatus;
                this.syncInteractionStatus();
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {InteractionStatusDefines.Status} interactionStatus
         * @return {SetInteractionStatusRequest}
         */
        factorySetInteractionStatusRequest: function(interactionStatus) {
            return new SetInteractionStatusRequest(interactionStatus);
        },

        /**
         * @private
         */
        startListeningForReconnect: function() {
            if (!this.isListeningForReconnect()) {
                this.listeningForReconnect = true;
                this.airbugApi.addEventListener(CallEvent.STARTED, this.hearCallStarted, this);
            }
        },

        /**
         * @private
         */
        stopListeningForReconnect: function() {
            if (this.isListeningForReconnect()) {
                this.listeningForReconnect = false;
                this.airbugApi.removeEventListener(CallEvent.STARTED, this.hearCallStarted, this);
            }
        },

        /**
         * @private
         * @param {InteractionStatusDefines.Status} interactionStatus
         */
        sendSetInteractionStatusRequest: function(interactionStatus) {
            var _this       = this;
            var request     = this.factorySetInteractionStatusRequest(interactionStatus);
            this.currentRequest = request;
            request.addCallback(function(throwable) {
                _this.currentRequest = null;
                if (!throwable) {
                    _this.acknowledgedStatus = interactionStatus;
                    if (_this.acknowledgedStatus !== _this.desiredStatus) {
                        _this.syncInteractionStatus();
                    }
                } else {
                    if (Class.doesExtend(throwable, RequestFailedException)) {
                        _this.startListeningForReconnect();
                    } else {
                        _this.logger.error(throwable.message, throwable.stack);
                    }
                }
            });
            this.airbugApi.sendApiRequest(request, function(throwable, outgoingRequest) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        },

        /**
         * @private
         */
        syncInteractionStatus: function() {
            if (this.desiredStatus !== this.acknowledgedStatus) {
                if (!this.currentRequest) {
                    this.sendSetInteractionStatusRequest(this.desiredStatus);
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallEvent} event
         */
        hearCallStarted: function(event) {
            this.stopListeningForReconnect();
            this.syncInteractionStatus();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(InteractionStatusDelegate).with(
        module("interactionStatusDelegate")
            .args([
                arg().ref("airbugApi"),
                arg().ref("logger")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbug.InteractionStatusDelegate', InteractionStatusDelegate);
});
