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
    connect: function(){
        this.bugCallClient.openConnection();
    },

    /**
     * @return {boolean}
     */
    isConnected: function(){
        return this.bugCallClient.isConnected();
    },

    /**
     * @return {boolean}
     */
    isNotConnected: function(){
        return !this.bugCallClient.isConnected();
    },

    /**
     * @param {string} type
     * @param {string} dataType
     * @param {{*}} requestData
     * @param {function(error, CallResponse)} callback
     */
    request: function(type, dataType, requestData, callback){
        this.bugCallClient.request(type + dataType, requestData, function(exception, callResponse) {
            if (!exception) {
                callback(error, callResponse);
            } else {
                callback(exception, null);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
