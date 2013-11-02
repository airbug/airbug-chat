//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugApi')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


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
        this.bugCallClient = bugCallClient;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    connect: function() {
        console.log("Inside AirbugApi#connect");
        console.log("opening connection");
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
    isNotConnected: function(){
        return !this.bugCallClient.isConnected();
    },

    /**
     *
     */
    refreshConnection: function(){
        this.disconnect();
        this.connect();
    },

    /**
     * @param {string} type
     * @param {string} dataType
     * @param {{*}} requestData
     * @param {function(error, CallResponse)} callback
     */
    request: function(type, dataType, requestData, callback){
        console.log("AirbugApi#request", type + dataType);
        this.bugCallClient.request(type + dataType, requestData, function(throwable, callResponse) {
            if (!throwable) {
                callback(undefined, callResponse);
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
