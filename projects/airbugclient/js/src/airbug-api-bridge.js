var bridge = {
  
  v: "0.0.1",
  ready: false,
  messageProcessor: null,

  receiveMessage: function(messageString, callback) {
    var messageObject = JSON.parse(messageString);
    if (bridge.ready) {
      bridge.processMessage(messageObject, callback);
    } else {
      bridge.queueMessage(messageObject, callback);
    }
  },
  
  sendMessage: function(messageObject, callback) {
    var messageString = JSON.stringify(messageObject);
    //Send messageString to the native layer
    //execute callback once that message has been ack.
  },
   
  processMessage: function(messageObject, callback) {
    bridge.messageProcessor.processMessage(messageObject, callback);
  },
   
  registerMessageProcessor: function(messageProcessor) {
    if (!bridge.messageProcessor) {
      bridge.messageProcessor = messageProcessor;
    } else {
      throw new Error("message processor already set");
    }
  }
};

window.bridge = bridge;