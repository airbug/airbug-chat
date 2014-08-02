/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


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
     * @type {function(string)}
     */
    this.receiverCallback   = null;
};

Bridge.prototype = {

    /**
     * @param {string} messageString
     */
    receiveMessage: function(messageString) {
        var messageObject = JSON.parse(messageString);

        if (this.ready) {
            this.processMessage(messageObject);
        } else {
            this.queueMessage(messageObject);
        }
    },

    /**
     * @param {{
     *      type: string,
     *      data: Object
     * }} messageObject
     */
    sendMessage: function(messageObject) {
        var messageString = JSON.stringify(messageObject);

        //Send messageString to the native layer
        if (this.receiverCallback) {
            this.receiverCallback(messageString);
        }
    },

    /**
     * @param {{
     *      type: string,
     *      data: Object
     * }} messageObject
     */
    processMessage: function(messageObject) {
        var _this = this;
        this.messageProcessor.processMessage(messageObject, function(responseObject) {
            _this.sendMessage(responseObject);
        });
    },

    /**
     * @param {{
     *      processMessage: function({type: string, data: Object})
     * }} messageProcessor
     */
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

    /**
     * @param {{
     *      type: string,
     *      data: Object
     * }} messageObject
     */
    queueMessage: function(messageObject) {
        this.queue.push({
            messageObject: messageObject
        });

    receiveFileData: function(streamId, chunk, reachedEOF) {
        console.log("Received chunk for " + streamId);
        // FIXME: this call doesn't seem to actually work
        this.messageProcessor.processFileData(streamId, chunk, reachedEOF);
    }
};

window.bridge = new Bridge();

// Helps get around issue where native code can't access the proper context when calling the bridge's prototype functions
window.receiveMessage = window.bridge.receiveMessage;
window.receiveFileData = window.bridge.receiveFileData;
