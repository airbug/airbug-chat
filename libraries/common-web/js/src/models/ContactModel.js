/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ContactModel')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.MeldModel')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
     * @class
     * @extends {MeldModel}
     */
    var ContactModel = Class.extend(MeldModel, {

        _name: "airbug.ContactModel",


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
        deinitializeModel: function() {
            this._super();
            if (this.getMeldDocument()) {
                this.getMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertySetChange, this);
            }
        },

        /**
         * @protected
         */
        initializeModel: function() {
            this._super();
            if (this.getMeldDocument()) {
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.deltaChange.propertyName")
                    .in(["id", "contactUserId", "ownerUserId"])
                    .call(this.hearMeldPropertySetChange, this);
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
            this.setProperty("id", contactData.id);
            this.setProperty("contactUserId", contactData.contactUserId);
            this.setProperty("ownerUserId", contactData.ownerUserId);
        },

        /**
         * @protected
         */
        unprocessMeldDocument: function() {
            this._super();
            this.removeProperty("id");
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
});
