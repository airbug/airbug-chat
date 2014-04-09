//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.SetInteractionStatusRequest')

//@Require('Class')
//@Require('airbug.ApiRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ApiRequest              = bugpack.require('airbug.ApiRequest');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SetInteractionStatusRequest = Class.extend(ApiRequest, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {InteractionStatusDefines.Status} interactionStatus
     */
    _constructor: function(interactionStatus) {
        var requestType = "setInteractionStatus";
        var requestData = {
            interactionStatus: interactionStatus
        };
        this._super(requestType, requestData);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {InteractionStatusDefines.Status}
         */
        this.interactionStatus      = interactionStatus;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {InteractionStatusDefines.Status}
     */
    getInteractionStatus: function() {
        return this.interactionStatus;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.SetInteractionStatusRequest', SetInteractionStatusRequest);
