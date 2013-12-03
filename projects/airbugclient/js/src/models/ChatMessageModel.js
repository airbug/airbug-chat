//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageModel')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.MappedMeldModel')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var MappedMeldModel     = bugpack.require('airbug.MappedMeldModel');
var MeldDocument        = bugpack.require('meldbug.MeldDocument');
var MeldDocumentEvent   = bugpack.require('meldbug.MeldDocumentEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {MappedMeldModel}
 */
var ChatMessageModel = Class.extend(MappedMeldModel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} dataObject
     * @param {MeldDocument} chatMessageMeldDocument
     * @param {MeldDocument} senderUserMeldDocument
     */
    _constructor: function(dataObject, chatMessageMeldDocument, senderUserMeldDocument) {
        var meldDocumentMap = new Map();
        meldDocumentMap.put("chatMessage", chatMessageMeldDocument);
        meldDocumentMap.put("senderUser", senderUserMeldDocument);
        this._super(dataObject, meldDocumentMap);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getChatMessageMeldDocument: function() {
        return this.getMeldDocument("chatMessage");
    },

    /**
     * @param {MeldDocument} chatMessageMeldDocument
     */
    setChatMessageMeldDocument: function(chatMessageMeldDocument) {
        this.putMeldDocument("chatMessage", chatMessageMeldDocument);
    },

    /**
     * @return {MeldDocument}
     */
    getSenderUserMeldDocument: function() {
        return this.getMeldDocoument("senderUser");
    },

    /**
     * @param {MeldDocument} senderUserMeldDocument
     */
    setSenderUserMeldDocument: function(senderUserMeldDocument) {
        this.putMeldDocument("senderUser", senderUserMeldDocument);
    },


    //-------------------------------------------------------------------------------
    // BugModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeModel: function() {
        this._super();
        if (this.getSenderUserMeldDocument()) {
            this.getSenderUserMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["firstName", "lastName"])
                .call(this.hearSenderUserPropertySetChange, this);
            this.getSenderUserMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["firstName", "lastName"])
                .call(this.hearSenderUserPropertyRemoveChange, this);
        } else if (this.getChatMessageMeldDocument()) {
            this.getChatMessageMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["_id", "sentAt", "conversationId", "tryUuid", "type"])
                .call(this.hearMeldPropertySetChange, this);
            this.getChatMessageMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["_id", "sentAt", "conversationId", "tryUuid", "type"])
                .call(this.hearMeldPropertyRemovedChange, this);
        }
    },

    /**
     * @protected
     */
    deinitializeModel: function() {
        this._super();
        if (this.getSenderUserMeldDocument()) {
            this.getSenderUserMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearSenderUserPropertySetChange, this);
            this.getSenderUserMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearSenderUserPropertyRemoveChange, this);
        } else if (this.getChatMessageMeldDocument()) {
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertySetChange, this);
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertyRemovedChange, this);
        }
    },


    //-------------------------------------------------------------------------------
    // MeldModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} key
     * @param {MeldDocument} meldDocument
     */
    processMeldDocument: function(key, meldDocument) {
        this._super();
        if (key === "chatMessage") {
            var chatMessageData    = meldDocument.getData();
            this.setProperty("_id", chatMessageData._id);
            this.setProperty("sentAt", chatMessageData.sentAt);
            this.setProperty("conversationId", chatMessageData.conversationId);
            this.setProperty("type", chatMessageData.type);
            this.setProperty("tryUuid", chatMessageData.tryUuid);
        } else if (key === "senderUser") {
            var senderUserData  = meldDocument.getData();
            this.setProperty("sentBy", senderUserData.firstName + " " + senderUserData.lastName);
        }
    },

    /**
     * @protected
     * @param {string} key
     * @param {MeldDocument} meldDocument
     */
    unprocessMeldDocument: function(key, meldDocument) {
        this._super();
        if (key === "chatMessage") {
            this.removeProperty("_id");
            this.removeProperty("sentAt");
            this.removeProperty("conversationId");
            this.removeProperty("type");
            this.removeProperty("tryUuid");
        } else if (key === "senderUser") {
            this.removeProperty("sentBy");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearSenderUserPropertySetChange: function(event) {
        var meldData    = event.getTarget().getData();
        this.setProperty("sentBy", meldData.firstName + " " + meldData.lastName);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearSenderUserPropertyRemoveChange: function(event) {
        this.removeProperty("sentBy");
    },

    /**
     * @private
     * @param {Event} event
     */
    hearMeldPropertySetChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        var propertyValue   = deltaChange.getPropertyValue();
        this.setProperty(propertyName, propertyValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearMeldPropertyRemovedChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        this.removeProperty(propertyName);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageModel", ChatMessageModel);
