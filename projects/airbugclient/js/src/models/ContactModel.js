//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactModel')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.MeldModel')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var MeldModel           = bugpack.require('airbug.MeldModel');
var MeldDocumentEvent   = bugpack.require('meldbug.MeldDocumentEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {MeldModel}
 */
var ContactModel = Class.extend(MeldModel, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getContactMeldDocument: function() {
        return this.getMeldDocument();
    },

    /**
     * @param {MeldDocument} contactMeldDocument
     */
    setContactMeldDocument: function(contactMeldDocument) {
        this.setMeldDocument(contactMeldDocument);
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
                .where("data.deltaChange.propertyName")
                .in(["_id", "contactUserId", "ownerUserId"])
                .call(this.hearMeldPropertySetChange, this);
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
        var contactData    = this.getMeldDocument().getData();
        this.setProperty("_id", contactData._id);
        this.setProperty("contactUserId", contactData.contactUserId);
        this.setProperty("ownerUserId", contactData.ownerUserId);
    },

    /**
     * @protected
     */
    unprocessMeldDocument: function() {
        this._super();
        this.removeProperty("_id");
        this.removeProperty("contactUserId");
        this.removeProperty("ownerUserId");
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
        this.setProperty(propertyName, deltaChange.getPropertyValue());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactModel", ContactModel);
