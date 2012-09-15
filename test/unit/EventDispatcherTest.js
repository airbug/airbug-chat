//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var EventDispatcher = require('../../lib/EventDispatcher');
var Event = require('../../lib/Event');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var EventDispatcherTest = {

    /**
     * This tests
     * 1) Instantiating an EventDispatcher
     * 2) That the dispatcher target is set to itself if no target is passed in during instantiation
     * 3) That the dispatcher target is set to the value passed in during instantiation
     */
    instantiateEventDispatcherTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var eventDispatcherWithoutTarget = new EventDispatcher();
        var testTarget = {};
        var eventDispatcherWithTarget = new EventDispatcher(testTarget);


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(eventDispatcherWithoutTarget.getTarget(), eventDispatcherWithoutTarget,
            "Assert dispatcher target is set to itself if no target is passed in during instantiation");
        this.assertEqual(eventDispatcherWithTarget.getTarget(), testTarget,
            "Assert dispatcher target is set to the target passed in during instantiation");


    }).with('@Test("Instantiate an EventDispatcher test")'),


    /**
     * This tests
     * 1) Adding and event listener
     * 2) Dispatching a simple event
     */
    simpleAddEventListenerDispatchEventTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var eventDispatcher = new EventDispatcher();
        var testEventType = "testEventType";
        var testEventData = "testEventData";
        var testEvent = new Event(testEventType, testEventData);

        var calledVar = false;
        var testContextVar = "some value";
        var _test = this;
        var testListenerFunction = function(event) {
            calledVar = true;
            _test.assertEqual(this.testContextVar, testContextVar,
                "Assert the listener function was called in the listener context");
            _test.assertEqual(event.getType(), testEventType,
                "Assert event type received was the event type published");
            _test.assertEqual(event.getData(), testEventData,
                "Assert event data received was the event data published");
            _test.assertEqual(event.getTarget(), eventDispatcher,
                "Assert event target is the dispatcher that dispatched the event");
        };
        var testListenerContext = {
            testContextVar: testContextVar
        };


        // Run Test
        //-------------------------------------------------------------------------------

        eventDispatcher.addEventListener(testEventType, testListenerFunction, testListenerContext);
        eventDispatcher.dispatchEvent(testEvent);
        this.assertTrue(calledVar, "Assert listener function was called.");

    }).with('@Test("Simple add event listener and dispatch event test")')

};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = EventDispatcherTest;
