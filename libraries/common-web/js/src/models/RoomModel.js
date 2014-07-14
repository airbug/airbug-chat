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

//@Export('airbug.RoomModel')

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
    var RoomModel = Class.extend(MeldModel, {

        _name: "airbug.RoomModel",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocument}
         */
        getRoomMeldDocument: function() {
            return this.getMeldDocument();
        },

        /**
         * @param {MeldDocument} roomMeldDocument
         */
        setRoomMeldDocument: function(roomMeldDocument) {
            this.setMeldDocument(roomMeldDocument);
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
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldRemovedFromSetChange, this);
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
                    .in(["id", "name", "conversationId", "roomMemberIdSet"])
                    .call(this.hearMeldPropertySetChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "name", "conversationId", "roomMemberIdSet"])
                    .call(this.hearMeldPropertyRemovedChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.ADDED_TO_SET])
                    .where("data.deltaChange.path")
                    .in(["roomMemberIdSet"])
                    .call(this.hearMeldAddedToSetChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.REMOVED_FROM_SET])
                    .where("data.deltaChange.path")
                    .in(["roomMemberIdSet"])
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
            this.setProperty("name", data.name);
            this.setProperty("conversationId", data.conversationId);
            this.setProperty("roomMemberIdSet", data.roomMemberIdSet);
        },

        /**
         * @protected
         */
        unprocessMeldDocument: function() {
            this._super();
            this.removeProperty("id");
            this.removeProperty("name");
            this.removeProperty("conversationId");
            this.removeProperty("roomMemberIdSet");
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
            var roomMemberIdSet     = this.getProperty("roomMemberIdSet");
            roomMemberIdSet.add(setValue);
        },

        /**
         * @private
         * @param {Event} event
         */
        hearMeldRemovedFromSetChange: function(event) {
            var deltaChange         = event.getData().deltaChange;
            var setValue            = deltaChange.getSetValue();
            var roomMemberIdSet     = this.getProperty("roomMemberIdSet");
            roomMemberIdSet.remove(setValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomModel", RoomModel);
});
