//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var PublisherSubscription = require('../../lib/PublisherSubscription');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var PublisherSubscriptionTest = {

    /**
     * This tests
     * 1) That subscriptions with the same function and context but different topics are not equal
     * 2) That subscriptions with the same function, context, and topic are equal
     */
    subscriptionEqualityTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testFunction = function() {};
        var tesObject = {};
        var testTopic1 = "topic1";
        var testTopic2 = "topic2";

        var notEqualPublisherSubscription1 = new PublisherSubscription(testTopic1, testFunction, tesObject);
        var notEqualPublisherSubscription2 = new PublisherSubscription(testTopic2, testFunction, tesObject);

        var equalPublisherSubscription1 = new PublisherSubscription(testTopic1, testFunction, tesObject);
        var equalPublisherSubscription2 = new PublisherSubscription(testTopic1, testFunction, tesObject);


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertNotEqual(notEqualPublisherSubscription1, notEqualPublisherSubscription2,
            "Assert subscriptions with the same function and context but different topics are not equal.");
        this.assertEqual(equalPublisherSubscription1, equalPublisherSubscription2,
            "Assert subscriptions with the same function, context, and topic are equal");


    }).with('@Test("Subscription equality test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = PublisherSubscriptionTest;
