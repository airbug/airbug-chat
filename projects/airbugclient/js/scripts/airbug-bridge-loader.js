var bridge = {
    applicationReady: false,
    messageProcessors: [],
    receiveMessage: function(messageObject) {
        if (bridge.applicationReady) {
            bridge.processMessage(messageObject);
        } else {
            bridge.queueMessage(messageObject);
        }
    },
    receiveResponse: function(responseObject) {

    },
    sendMessage: function(messageObject) {

    },
    sendResponse: function(messageId, responseObject) {
        //How to send command to native layer?
    },

    makeApplicationReady: function() {
        bridge.applicationReady = true;
        bridge.processMessages();
    },

    registerMessageProcessor: function(messageProcessor) {
        bridge.messageProcessors.push(messageProcessor);
    },

    processMessage: function(messageObject) {
        bridge.messageProcessors.forEach(function(messageProcessor) {
           messageProcessor.processMessage(messageObject);
        });
    }
};
window.bridge = bridge;
