//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TextChatMessageModel')

//@Require('Class')
//@Require('airbug.ChatMessageModel')
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
var ChatMessageModel        = bugpack.require('airbug.ChatMessageModel');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentEvent       = bugpack.require('meldbug.MeldDocumentEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TextChatMessageModel    = Class.extend(ChatMessageModel, {

    //-------------------------------------------------------------------------------
    // BugModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeModel: function() {
        this._super();
        if (this.getChatMessageMeldDocument()) {
            this.getChatMessageMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["body"])
                .call(this.hearTextPropertySetChange, this);
            this.getChatMessageMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["body"])
                .call(this.hearTextPropertyRemovedChange, this);
        }
    },

    /**
     * @protected
     */
    deinitializeModel: function() {
        this._super();
        if (this.getChatMessageMeldDocument()) {
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearTextPropertySetChange, this);
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearTextPropertyRemovedChange, this);
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
        this._super(key, meldDocument);
        if (key === "chatMessage") {
            var chatData    = meldDocument.getData();
            this.setProperty("body", chatData.body);
        }
    },

    /**
     * @protected
     * @param {string} key
     * @param {MeldDocument} meldDocument
     */
    unprocessMeldDocument: function(key, meldDocument) {
        this._super(key, meldDocument);
        if (key === "chatMessage") {
            this.removeProperty("body");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearTextPropertySetChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        var propertyValue   = deltaChange.getPropertyValue();
        this.setProperty(propertyName, propertyValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearTextPropertyRemovedChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        this.removeProperty(propertyName);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TextChatMessageModel", TextChatMessageModel);
