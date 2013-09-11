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
     * @param {string} type
     * @param {string} dataType
     * @param {{*}} requestData
     * @param {function(error, {*})} callback
     */
    request: function(type, dataType, requestData, callback){
        this.bugCallClient.request(type + dataType, requestData, function(exception, callResponse){
            if(!exception){
                var type        = callResponse.getType();
                var data        = callResponse.getData();
                var error       = data.error;
                callback(error, data);
            } else {
                callback(exception, null);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // ChatMessage Related Api Methods
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Conversation Related Api Methods
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Room Related Api Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // User Related Api Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    loginUser: function(callback){
        var error = null;
        try{
            this.bugCallClient.openConnection();
        } catch(e){
            error = e;
        } finally {
            callback(error);
        }
    },

    /**
     * @param {function(error)} callback
     */
    logoutCurrentUser: function(callback){
        var _this = this;
        this.request("logout", "CurrentUser", {}, function(error){
            callback(error);
        });
    },

    /**
     * @param {function(error)} callback
     */
    registerUser: function(callback){
        var error = null;
        try{
            this.bugCallClient.openConnection();
        } catch(e){
            error = e;
        } finally {
            callback(error);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
