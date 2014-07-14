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

//@Export('airbug.CurrentUser')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CurrentUser = Class.extend(Obj, {

        _name: "airbug.CurrentUser",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldDocument} meldDocument
         */
        _constructor: function(meldDocument) {

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MeldDocument}
             */
            this.meldDocument = meldDocument;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {MeldDocument}
         */
        getMeldDocument: function() {
            return this.meldDocument;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getFullName: function() {
            var data = this.meldDocument.getData();
            return data.firstName + " " + data.lastName;
        },

        /**
         * @return {string}
         */
        getId: function() {
            return this.meldDocument.getData().id;
        },

        /**
         * @return {Set.<string>}
         */
        getRoomIdSet: function() {
            return this.meldDocument.getData().roomIdSet;
        },

        /**
         * @return {boolean}
         */
        isLoggedIn: function() {
            if(!this.meldDocument){
                return false;
            } else {
                return !this.meldDocument.getData().anonymous;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CurrentUser", CurrentUser);
});
