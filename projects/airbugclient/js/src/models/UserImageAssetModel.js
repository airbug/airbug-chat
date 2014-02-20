//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserImageAssetModel')

//@Require('Class')
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

var Class                   = bugpack.require('Class');
var MappedMeldModel         = bugpack.require('airbug.MappedMeldModel');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentEvent       = bugpack.require('meldbug.MeldDocumentEvent');



//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {MappedMeldModel}
 */
var UserImageAssetModel = Class.extend(MappedMeldModel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} dataObject
     * @param {MeldDocument} imageAssetMeldDocument
     * @param {MeldDocument} userAssetMeldDocument
     */
    _constructor: function(dataObject, imageAssetMeldDocument, userAssetMeldDocument) {
        var meldDocumentMap = new Map();
        if (imageAssetMeldDocument) {
            meldDocumentMap.put("imageAsset", imageAssetMeldDocument);
        }
        if (userAssetMeldDocument) {
            meldDocumentMap.put("userAsset", userAssetMeldDocument);
        }
        this._super(dataObject, meldDocumentMap);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getImageAssetMeldDocument: function() {
        return this.getMeldDocument("imageAsset");
    },

    /**
     * @param {MeldDocument} imageAssetMeldDocument
     */
    setImageAssetMeldDocument: function(imageAssetMeldDocument) {
        this.putMeldDocument("imageAsset", imageAssetMeldDocument);
    },

    /**
     * @return {MeldDocument}
     */
    getUserAssetMeldDocument: function() {
        return this.getMeldDocument("userAsset");
    },

    /**
     * @param {MeldDocument} userAssetMeldDocument
     */
    setUserAssetMeldDocument: function(userAssetMeldDocument) {
        this.putMeldDocument("userAsset", userAssetMeldDocument);
    },


    //-------------------------------------------------------------------------------
    // BugModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeModel: function() {
        this._super();
        if (this.getUserAssetMeldDocument()) {
            this.getUserAssetMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["id", "userId", "assetId"])
                .call(this.hearUserAssetPropertySetChange, this);
            this.getUserAssetMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["id", "userId", "assetId"])
                .call(this.hearUserAssetPropertyRemovedChange, this);
        }
        if (this.getImageAssetMeldDocument()) {
            this.getImageAssetMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                .where("data.deltaChange.propertyName")
                .in(["midsizeMimeType", "midsizeUrl", "mimeType", "name", "size", "thumbnailMimeType", "thumbnailUrl", "url"])
                .call(this.hearImageAssetPropertySetChange, this);
            this.getImageAssetMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["midsizeMimeType", "midsizeUrl", "mimeType", "name", "size", "thumbnailMimeType", "thumbnailUrl", "url"])
                .call(this.hearImageAssetPropertyRemovedChange, this);
        }
    },

    /**
     * @protected
     */
    deinitializeModel: function() {
        this._super();
        if (this.getUserAssetMeldDocument()) {
            this.getUserAssetMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearUserAssetPropertySetChange, this);
            this.getUserAssetMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearUserAssetPropertyRemovedChange, this);
        }
        if (this.getImageAssetMeldDocument()) {
            this.getImageAssetMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearImageAssetPropertySetChange, this);
            this.getImageAssetMeldDocument()
                .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearImageAssetPropertyRemovedChange, this);
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
        var data = meldDocument.getData();
        if (key === "userAsset") {
            this.setProperty("id",      data.id);
            this.setProperty("userId",  data.userId);
            this.setProperty("assetId", data.assetId);
        } else if (key === "imageAsset") {
            this.setProperty("midsizeMimeType",     data.midsizeMimeType);
            this.setProperty("midsizeUrl",          data.midsizeUrl);
            this.setProperty("mimeType",            data.mimeType);
            this.setProperty("name",                data.name);
            this.setProperty("size",                data.size);
            this.setProperty("thumbnailMimeType",   data.thumbnailMimeType);
            this.setProperty("thumbnailUrl",        data.thumbnailUrl);
            this.setProperty("url",                 data.url);
        }
    },

    /**
     * @protected
     * @param {string} key
     * @param {MeldDocument} meldDocument
     */
    unprocessMeldDocument: function(key, meldDocument) {
        this._super();
        if (key === "userAsset") {
            this.removeProperty("id");
            this.removeProperty("userId");
            this.removeProperty("assetId");
        } else if (key === "imageAsset") {
            this.removeProperty("midsizeMimeType");
            this.removeProperty("midsizeUrl");
            this.removeProperty("mimeType");
            this.removeProperty("name");
            this.removeProperty("size");
            this.removeProperty("thumbnailMimeType");
            this.removeProperty("thumbnailUrl");
            this.removeProperty("url");
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearImageAssetPropertySetChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        var propertyValue   = deltaChange.getPropertyValue();
        this.setProperty(propertyName, propertyValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearImageAssetPropertyRemovedChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        this.removeProperty(propertyName);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearUserAssetPropertySetChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        var propertyValue   = deltaChange.getPropertyValue();
        this.setProperty(propertyName, propertyValue);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearUserAssetPropertyRemovedChange: function(event) {
        var deltaChange     = event.getData().deltaChange;
        var propertyName    = deltaChange.getPropertyName();
        this.removeProperty(propertyName);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserImageAssetModel", UserImageAssetModel);
