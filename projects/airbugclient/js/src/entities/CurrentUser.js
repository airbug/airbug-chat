//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUser')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var CurrentUser = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(meldDocument) {

        //-------------------------------------------------------------------------------
        // Declare Variables
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
