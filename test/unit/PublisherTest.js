//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Publisher = require('../../lib/Publisher');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var PublisherTest = {
    /**
     * This tests
     * 1) Subscribing to a topic.
     */
    publisherSubscribePublishTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var publisher = new Publisher();
        var calledVar = false;
        var testContextVar = "some value";
        var _test = this;
        var testContext = {
            testContextVar: testContextVar
        };
        var testData = "my message";
        var testTopic = 'test topic';
        var testFunction = function(message) {
            calledVar = true;
            _test.assertEqual(this.testContextVar, testContextVar,
                "Assert the subscriber function was called in the subscriber context");
            _test.assertEqual(message.getTopic(), testTopic,
                "Assert message topic received was the message topic published");
            _test.assertEqual(message.getData(), testData,
                "Assert message data received was the message data published");
        };



        // Run Test
        //-------------------------------------------------------------------------------

        publisher.subscribe(testTopic, testFunction, testContext);
        publisher.publish(testTopic, testData);

        this.assertTrue(calledVar, "Assert subscriber function was called.");

    }).with('@Test("Publisher subscribe and publish test")')

};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = PublisherTest;
