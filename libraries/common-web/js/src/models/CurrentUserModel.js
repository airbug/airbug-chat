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

//@Export('airbug.CurrentUserModel')

//@Require('Class')
//@Require('airbug.MeldModel')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var MeldModel           = bugpack.require('airbug.MeldModel');
    var MeldDocument        = bugpack.require('meldbug.MeldDocument');
    var MeldDocumentEvent   = bugpack.require('meldbug.MeldDocumentEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MeldModel}
     */
    var CurrentUserModel = Class.extend(MeldModel, /** @lends {CurrentUserModel.prototype} */{

        _name: "airbug.CurrentUserModel",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocument}
         */
        getCurrentUserMeldDocument: function() {
            return this.getMeldDocument();
        },

        /**
         * @param {MeldDocument} currentUserMeldDocument
         */
        setCurrentUserMeldDocument: function(currentUserMeldDocument) {
            this.setMeldDocument(currentUserMeldDocument);
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
                this.getMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertyRemovedChange, this);
                this.getMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldAddedToSetChange, this);
                this.getMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldAddedToSetChange, this);
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
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "email", "firstName", "lastName", "status", "roomIdSet"])
                    .call(this.hearMeldPropertySetChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "email", "firstName", "lastName", "status", "roomIdSet"])
                    .call(this.hearMeldPropertyRemovedChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.ADDED_TO_SET])
                    .where("data.deltaChange.path")
                    .in(["roomIdSet"])
                    .call(this.hearMeldAddedToSetChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.REMOVED_FROM_SET])
                    .where("data.deltaChange.path")
                    .in(["roomIdSet"])
                    .call(this.hearMeldRemovedFromSetChange, this);
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
            this.setProperty("id", data.id);
            this.setProperty("email", data.email);
            this.setProperty("firstName", data.firstName);
            this.setProperty("lastName", data.lastName);
            this.setProperty("roomIdSet", data.roomIdSet);
            this.setProperty("status", data.status);
        },

        /**
         * @protected
         */
        unprocessMeldDocument: function() {
            this._super();
            this.removeProperty("id");
            this.removeProperty("email");
            this.removeProperty("firstName");
            this.removeProperty("lastName");
            this.removeProperty("roomIdSet");
            this.removeProperty("status");
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearMeldAddedToSetChange: function(event) {
            var deltaChange         = event.getData().deltaChange;
            var setValue            = deltaChange.getSetValue();
            var roomIdSet           = this.getProperty("roomIdSet");
            roomIdSet.add(setValue);
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
        hearMeldRemovedFromSetChange: function(event) {
            var deltaChange         = event.getData().deltaChange;
            var setValue            = deltaChange.getSetValue();
            var roomIdSet           = this.getProperty("roomIdSet");
            roomIdSet.remove(setValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CurrentUserModel", CurrentUserModel);
});
