/**
 * @constructor
 */
var Bridge = function() {

    /**
     * @private
     * @type {string}
     */
    this.v                  = "0.0.1";

    /**
     * @private
     * @type {boolean}
     */
    this.ready              = false;

    /**
     * @private
     * @type {Array}
     */
    this.queue              = [];

    /**
     * @private
     * @type {null}
     */
    this.messageProcessor   = null;

    /**
     * @private
     * @type {null}
     */
    this.receiverCallback   = null;
};

Bridge.prototype = {

    receiveMessage: function(messageString) {
        var messageObject = JSON.parse(messageString);
        if (this.ready) {
            this.processMessage(messageObject);
        } else {
            this.queueMessage(messageObject);
        }
    },

    sendMessage: function(messageObject) {
        var messageString = JSON.stringify(messageObject);
        //Send messageString to the native layer
        if (this.receiverCallback) {
            this.receiverCallback(messageString);
        }
        //execute callback once that message has been ack.
    },

    processMessage: function(messageObject) {
        this.messageProcessor.processMessage(messageObject);
    },

    registerMessageProcessor: function(messageProcessor) {
        if (!this.messageProcessor) {
            this.messageProcessor = messageProcessor;
        } else {
            throw new Error("message processor already set");
        }

        // Process messages in queue
        while (this.queue.length > 0) {
            var queuedItemHash = this.queue.shift();
            var messageObject = queuedItemHash.messageObject;
            this.processMessage(messageObject);
        }
    },

    queueMessage: function(messageObject, callback) {
        this.queue.push({ messageObject: messageObject});
    }
};

window.bridge = new Bridge();
