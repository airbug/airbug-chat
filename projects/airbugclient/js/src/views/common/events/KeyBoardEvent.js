//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('KeyBoardEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Event       = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var KeyBoardEvent = Class.extend(Event, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(eventType, keyCode, controlKey, shiftKey, altKey, event) {

        this._super(eventType, {
            event: event
        });


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.altKey         = altKey;

        /**
         * @private
         * @type {boolean}
         */
        this.controlKey     = controlKey;

        /**
         * @private
         * @type {number}
         */
        this.keyCode        = keyCode;

        /**
         * @private
         * @type {boolean}
         */
        this.shiftKey       = shiftKey;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getAltKey: function() {
        return this.altKey;
    },

    /**
     * @return {boolean}
     */
    getControlKey: function() {
        return this.controlKey;
    },

    /**
     * @return {number}
     */
    getKeyCode: function() {
        return this.keyCode;
    },

    /**
     * @return {boolean}
     */
    getShiftKey: function() {
        return this.shiftKey;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
KeyBoardEvent.EventTypes = {
    KEY_DOWN: "KeyBoardEvent:KeyDown",
    KEY_PRESS: "KeyBoardEvent:KeyPress",
    KEY_UP: "KeyBoardEvent:KeyUp"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.KeyBoardEvent", KeyBoardEvent);
