//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugApi')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('airbug.ApiRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var List            = bugpack.require('List');
var Obj             = bugpack.require('Obj');
var ApiRequest      = bugpack.require('airbug.ApiRequest');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugApi = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    connect: function() {
        this.bugCallClient.openConnection();
    },

    /**
     *
     */
    disconnect: function() {
        this.bugCallClient.closeConnection();
    },

    /**
     * @return {boolean}
     */
    isConnected: function() {
        return this.bugCallClient.isConnected();
    },

    /**
     * @return {boolean}
     */
    isNotConnected: function() {
        return !this.bugCallClient.isConnected();
    },

    /**
     *
     */
    refreshConnection: function() {
        this.disconnect();
        this.connect();
    },

    /**
     * @param {string} requestType
     * @param {*} requestData
     * @param {function(Throwable, CallResponse=)} callback
     */
    request: function(requestType, requestData, callback) {
        console.log("AirbugApi#request", requestType);
        this.bugCallClient.request(requestType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                callback(null, callResponse);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {ApiRequest} apiRequest
     */
    sendRequest: function(apiRequest) {
        if (!apiRequest.isSent() && !this.currentRequestList.contains(apiRequest)) {
            this.addRequest(apiRequest);
            apiRequest.sendRequest();
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
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
