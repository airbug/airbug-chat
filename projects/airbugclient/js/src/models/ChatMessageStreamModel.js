//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageStreamModel')

//@Require('Class')
//@Require('airbug.MeldModel')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var MeldModel               = bugpack.require('airbug.MeldModel');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentEvent       = bugpack.require('meldbug.MeldDocumentEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {MeldModel}
 */
var ChatMessageStreamModel = Class.extend(MeldModel, /** @lends {ChatMessageStreamModel.prototype} */{

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getConversationChatMessageStreamMeldDocument: function() {
        return this.getMeldDocument();
    },

    /**
     * @param {MeldDocument} conversationChatMessageStreamMeldDocument
     */
    setConversationChatMessageStreamMeldDocument: function(conversationChatMessageStreamMeldDocument) {
        this.setMeldDocument(conversationChatMessageStreamMeldDocument)
    },


    //-------------------------------------------------------------------------------
    // BugModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeModel: function() {
        this._super();
        if (this.getMeldDocument()) {
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["chatMessageIdSet"])
                .call(this.hearMeldPropertySetChange, this);
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["chatMessageIdSet"])
                .call(this.hearMeldPropertyRemovedChange, this);
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.ADDED_TO_SET])
                .where("data.deltaChange.path")
                .in(["chatMessageIdSet"])
                .call(this.hearMeldAddedToSetChange, this);
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.REMOVED_FROM_SET])
                .where("data.deltaChange.path")
                .in(["chatMessageIdSet"])
                .call(this.hearMeldRemovedFromSetChange, this);
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.RESET, this.hearMeldReset, this);
        }
    },

    /**
     * @protected
     */
    deinitializeModel: function() {
        this._super();
        if (this.getMeldDocument()) {
            this.getMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertySetChange, this);
            this.getMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertyRemovedChange, this);
            this.getMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldAddedToSetChange, this);
            this.getMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldAddedToSetChange, this);
        }
    },


    //-------------------------------------------------------------------------------
    // MeldModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    processMeldDocument: function() {
        this._super();
        var data    = this.getMeldDocument().getData();
        if (data) {
            this.setProperty("chatMessageIdSet", data.chatMessageIdSet);
        }
    },

    /**
     * @protected
     */
    unprocessMeldDocument: function() {
        this._super();
        this.removeProperty("chatMessageIdSet");
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

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
    },

    /**
     * @private
     * @param {Event} event
     */
    hearMeldAddedToSetChange: function(event) {
        var deltaChange         = event.getData().deltaChange;
        var setValue            = deltaChange.getSetValue();
        var chatMessageIdSet    = this.getProperty("chatMessageIdSet");
        chatMessageIdSet.add(setValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearMeldRemovedFromSetChange: function(event) {
        var deltaChange         = event.getData().deltaChange;
        var setValue            = deltaChange.getSetValue();
        var chatMessageIdSet    = this.getProperty("chatMessageIdSet");
        chatMessageIdSet.remove(setValue);
    },

    /**
     * @param {Event} event
     */
    hearMeldReset: function(event) {
        this.processMeldDocument();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageStreamModel", ChatMessageStreamModel);
