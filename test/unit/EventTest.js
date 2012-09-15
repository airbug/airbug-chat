//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Event = require('../../lib/Event');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var EventTest = {
    /**
     * This tests
     * 1) Instantiation of a new Event
     * 2) That the "target" value is null after instantiation since the target is set when the event is dispatched
     */
    instantiateEventTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testType = "testEventType";
        var testData = "testEventData";
        var event = new Event(testType, testData);


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(event.getType(), testType,
            "Assert event type was set correctly during instantiation");
        this.assertEqual(event.getData(), testData,
            "Assert event data was set correctly during instantiation");
        this.assertEqual(event.getTarget(), null,
            "Assert target is null after instantiation");

    }).with('@Test("Event instantiation test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = EventTest;
