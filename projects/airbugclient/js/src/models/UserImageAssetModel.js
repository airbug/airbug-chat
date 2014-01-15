//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserImageAssetModel')

//@Require('Class')
//@Require('airbug.MeldModel')
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
var UserImageAssetModel = Class.extend(MeldModel, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getUserAssetMeldDocument: function() {
        return this.getMeldDocument();
    },

    /**
     * @param {MeldDocument} assetMeldDocument
     */
    setUserAssetMeldDocument: function(assetMeldDocument) {
        this.setMeldDocument(assetMeldDocument);
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
                .in(["id", "userId", "assetId"])
                .call(this.hearMeldPropertySetChange, this);
            this.getMeldDocument()
                .on(MeldDocumentEvent.EventTypes.CHANGE)
                .where("data.changeType")
                .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                .where("data.deltaChange.propertyName")
                .in(["id", "userId", "assetId"])
                .call(this.hearMeldPropertyRemovedChange, this);
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
        this.setProperty("id",      data.id);
        this.setProperty("userId",  data.userId);
        this.setProperty("assetId", data.assetId);
    },

    /**
     * @protected
     */
    unprocessMeldDocument: function() {
        this._super();
        this.removeProperty("id",      data.id);
        this.removeProperty("userId",  data.userId);
        this.removeProperty("assetId", data.assetId);
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserImageAssetModel", UserImageAssetModel);
