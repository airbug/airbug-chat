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

//@Export('airbug.SetInteractionStatusRequest')

//@Require('Class')
//@Require('airbug.ApiRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ApiRequest              = bugpack.require('airbug.ApiRequest');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApiRequest}
     */
    var SetInteractionStatusRequest = Class.extend(ApiRequest, {

        _name: "airbug.SetInteractionStatusRequest",


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
});
