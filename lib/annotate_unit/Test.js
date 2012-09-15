//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var AssertionResult = require('./AssertionResult');
var Class = require('../Class');
var Event = require('../Event');
var EventDispatcher = require('../EventDispatcher');
var HashUtil = require('../HashUtil');
var Obj = require('../Obj');
var TypeUtil = require('../TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Test = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, testFunction) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.name = name;

        this.testFunction = testFunction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getName: function() {
        return this.name;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param value1
     * @param value2
     * @param message
     */
    assertEqual: function(value1, value2, message) {
        var equal = this.areEqual(value1, value2);

        if (equal) {
            this.dispatchAssertionResultEvent(true,
                "[SUCCESS] " + message + " - Assert [equal] - expected:" + value2 + " given:" + value1);
        } else {
            this.dispatchAssertionResultEvent(false,
                "[FAIL] " + message + " - Assert [equal] - expected:" + value2 + " given:" + value1);
        }
    },

    assertNotEqual: function(value1, value2, message) {
        var notEqual = !this.areEqual(value1, value2);
        if (notEqual) {
            this.dispatchAssertionResultEvent(true,
                "[SUCCESS] " + message + " - Assert [not equal] - expected:" + value2 + " given:" + value1);
        } else {
            this.dispatchAssertionResultEvent(false,
                "[FAIL] " + message + " - Assert [not equals] - expected:" + value2 + " given:" + value1);
        }
    },

    assertTrue: function(value, message) {
        if (value) {
            this.dispatchAssertionResultEvent(true,
                "[SUCCESS] " + message + " - Assert [true] - result:" + value);
        } else {
            this.dispatchAssertionResultEvent(false,
                "[FAIL] " + message + " - Assert [true] - result:" + value);
        }
    },

    assertFalse: function(value, message) {
        if (!value) {
            this.dispatchAssertionResultEvent(true,
                "[SUCCESS] " + message + " - Assert [false] - result:" + value);
        } else {
            this.dispatchAssertionResultEvent(false,
                "[FAIL] " + message + " - Assert [false] - result:" + value);
        }
    },

    runTest: function() {
        this.testFunction();
    },

    dispatchAssertionResultEvent: function(valid, message) {
        var assertionResult = new AssertionResult(valid, message);
        this.dispatchEvent(new Event(Test.EventTypes.ASSERTION_RESULT, assertionResult));
    },

    /**
     * This test uses the exact comparison operator (===) to test for equality.
     * @private
     * @param {*} value1
     * @param {*} value2
     */
    areEqual: function(value1, value2) {
        return Obj.equals(value1, value2);
    }
});


//-------------------------------------------------------------------------------
// Static Event Types
//-------------------------------------------------------------------------------

Test.EventTypes = {
    ASSERTION_RESULT: 'assertion_result'
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Test;
