//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageChatMessageModel')

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

var ImageChatMessageModel    = Class.extend(ChatMessageModel, {

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
                .call(this.hearImagePropertySetChange, this);
            this.getChatMessageMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["body"])
                .call(this.hearImagePropertyRemovedChange, this);
        }
    },

    /**
     * @protected
     */
    deinitializeModel: function() {
        this._super();
        if (this.getChatMessageMeldDocument()) {
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearCodePropertySetChange, this);
            this.getChatMessageMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearCodePropertyRemovedChange, this);
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
            var imageData   = chatData.body.parts[0];
            this.setProperty("filename",        imageData.name);
            this.setProperty("url",             imageData.url);
            this.setProperty("thumbnailUrl",    imageData.thumbnailUrl);
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
            this.removeProperty("filename");
            this.removeProperty("url");
            this.removeProperty("thumbnailUrl");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearImagePropertySetChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        var propertyValue   = deltaChange.getPropertyValue();
        this.setProperty(propertyName, propertyValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearImagePropertyRemovedChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        this.removeProperty(propertyName);
    },


});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageChatMessageModel", ImageChatMessageModel);
