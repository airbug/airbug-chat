//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApiRequest')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('List')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var ArgUtil                 = bugpack.require('ArgUtil');
var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Event                   = bugpack.require('Event');
var EventDispatcher         = bugpack.require('EventDispatcher');
var List                    = bugpack.require('List');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApiRequest = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} requestType
     * @param {*} requestData
     */
    _constructor: function(requestType, requestData) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallClient}
         */
        this.bugCallClient  = null;

        /**
         * @private
         * @type {List.<function(Throwable=)>}
         */
        this.callbackList           = new List();

        /**
         * @private
         * @type {boolean}
         */
        this.processingResponse     = false;

        /**
         * @private
         * @type {*}
         */
        this.requestData            = requestData;

        /**
         * @private
         * @type {string}
         */
        this.requestType            = requestType;

        /**
         * @private
         * @type {boolean}
         */
        this.sent                   = false;
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
     * @param {BugCallClient} bugCallClient
     */
    setBugCallClient: function(bugCallClient) {
        this.bugCallClient = bugCallClient;
    },

    /**
     * @return {List.<function(Throwable=)>}
     */
    getCallbackList: function() {
        return this.callbackList;
    },

    /**
     * @return {boolean}
     */
    getProcessingResponse: function() {
        return this.processingResponse;
    },

    /**
     * @return {*}
     */
    getRequestData: function() {
        return this.requestData;
    },

    /**
     * @return {string}
     */
    getRequestType: function() {
        return this.requestType;
    },

    /**
     * @return {boolean}
     */
    getSent: function() {
        return this.sent;
    },

    /**
     * @return {boolean}
     */
    isProcessingResponse: function() {
        return this.getProcessingResponse();
    },

    /**
     * @return {boolean}
     */
    isSent: function() {
        return this.getSent();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    addCallback: function(callback) {
        if (!this.isProcessingResponse()) {
            this.callbackList.add(callback);
        } else {
            throw new Bug("InvalidState", {}, "Cannot add a callback after the response has started processing");
        }
    },

    /**
     *
     */
    sendRequest: function() {
        if (!this.sent) {
            this.sent = true;
            this.processRequest();
        } else {
            throw new Bug("InvalidState", {}, "Request can only be sent once");
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    completeRequest: function() {
        this.dispatchEvent(new Event(ApiRequest.EventTypes.REQUEST_COMPLETE));
    },

    /**
     * @protected
     * @param {Throwable} throwable
     * @param {CallResponse} callResponse
     */
    doProcessResponse: function(throwable, callResponse) {
        this.fireCallbacks(throwable, callResponse);
    },

    /**
     * @protected
     */
    doSendRequest: function() {
        var _this = this;
        this.bugCallClient.request(this.requestType, this.requestData, function(throwable, callResponse) {
            _this.processResponse(throwable, callResponse);
            _this.completeRequest();
        });
    },

    /**
     * @protected
     * @params {...} args
     */
    fireCallbacks: function() {
        var args = ArgUtil.toArray(arguments);
        this.callbackList.forEach(function(callback) {
            callback.apply(null, args);
        });
    },

    /**
     * @protected
     */
    processRequest: function() {
        this.doSendRequest();
    },

    /**
     * @protected
     * @param {Throwable} throwable
     * @param {CallResponse} callResponse
     */
    processResponse: function(throwable, callResponse) {
        if (!this.isProcessingResponse()) {
            this.processingResponse = true;
            this.dispatchEvent(new Event(ApiRequest.EventTypes.PROCESSING_RESPONSE));
            this.doProcessResponse(throwable, callResponse);
        } else {
            throw new Bug("Error", {}, "Response already processing");
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
ApiRequest.EventTypes = {
    PROCESSING_RESPONSE: "ApiRequest:ProcessingResponse",
    REQUEST_COMPLETE: "ApiRequest:RequestComplete"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.ApiRequest', ApiRequest);
