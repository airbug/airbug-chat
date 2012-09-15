//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Message = require('../../lib/Message');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var MessageTest = {
    /**
     * This tests
     * 1) Instantiation of a Message
     * 2) That the topic and data values were set correctly during instantiation
     */
    instantiateMessageTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testTopic = "testTopic";
        var testData = "testData";
        var message = new Message(testTopic, testData);


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(message.getTopic(), testTopic,
            "Assert message topic was set correctly during instantiation");
        this.assertEqual(message.getData(), testData,
            "Assert message data was set correctly during instantiation");

    }).with('@Test("Message instantiation test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = MessageTest;
