var bridge = {
  
  v: "0.0.1",
  ready: false,
  queue: [],
  messageProcessor: null,
  receiverCallback: null,

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
    if (receiverCallback) {
      receiverCallback(messageString);
    }
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

    // Process messages in queue
    while (bridge.queue.length > 0) {
      var queuedItemHash = bridge.queue.shift();
      var messageObject = queuedItemHash.messageObject;
      var callback = queuedItemHash.callback;
      bridge.processMessage(messageObject, callback);
    }
  },

  queueMessage: function(messageObject, callback) {
    bridge.queue.push({ messageObject: messageObject, callback: callback });
  },

};

window.bridge = bridge;