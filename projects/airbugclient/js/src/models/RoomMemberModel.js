//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomMemberModel')

//@Require('Class')
//@Require('Map')
//@Require('airbug.MappedMeldModel')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
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
    var RoomMemberModel = Class.extend(MappedMeldModel, /** @lends {RoomMemberModel.prototype} */ {

        _name: "airbug.RoomMemberModel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} dataObject
         * @param {MeldDocument} roomMemberMeldDocument
         * @param {MeldDocument} userMeldDocument
         */
        _constructor: function(dataObject, roomMemberMeldDocument, userMeldDocument) {
            var meldDocumentMap = new Map();
            if (roomMemberMeldDocument) {
                meldDocumentMap.put("roomMember", roomMemberMeldDocument);
            }
            if (userMeldDocument) {
                meldDocumentMap.put("user", userMeldDocument);
            }
            this._super(dataObject, meldDocumentMap);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocument}
         */
        getRoomMemberMeldDocument: function() {
            return this.getMeldDocument("roomMember");
        },

        /**
         * @param {MeldDocument} roomMemberMeldDocument
         */
        setRoomMemberMeldDocument: function(roomMemberMeldDocument) {
            this.putMeldDocument("roomMember", roomMemberMeldDocument);
        },

        /**
         * @return {MeldDocument}
         */
        getUserMeldDocument: function() {
            return this.getMeldDocument("user");
        },

        /**
         * @param {MeldDocument} userMeldDocument
         */
        setUserMeldDocument: function(userMeldDocument) {
            this.putMeldDocument("user", userMeldDocument);
        },


        //-------------------------------------------------------------------------------
        // BugModel Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeModel: function() {
            this._super();
            if (this.getRoomMemberMeldDocument()) {
                this.getRoomMemberMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertySetChange, this);
                this.getRoomMemberMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertyRemovedChange, this);
            }
            if (this.getUserMeldDocument()) {
                this.getUserMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertySetChange, this);
                this.getUserMeldDocument()
                    .off(MeldDocumentEvent.EventTypes.CHANGE, this.hearMeldPropertyRemovedChange, this);
            }
        },

        /**
         * @protected
         */
        initializeModel: function() {
            this._super();
            if (this.getRoomMemberMeldDocument()) {
                this.getRoomMemberMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "roomId", "userId"])
                    .call(this.hearMeldPropertySetChange, this);
                this.getRoomMemberMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "roomId", "userId"])
                    .call(this.hearMeldPropertyRemovedChange, this);
            }
            if (this.getUserMeldDocument()) {
                this.getUserMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_SET])
                    .where("data.deltaChange.propertyName")
                    .in(["firstName", "lastName", "status"])
                    .call(this.hearMeldPropertySetChange, this);
                this.getUserMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                    .where("data.deltaChange.propertyName")
                    .in(["firstName", "lastName", "status"])
                    .call(this.hearMeldPropertyRemovedChange, this);
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
            var data    = meldDocument.getData();
            if (key === "roomMember") {
                this.setProperty("id", data.id);
                this.setProperty("roomId", data.roomId);
                this.setProperty("userId", data.userId);
            } else if (key === "user") {
                this.setProperty("firstName", data.firstName);
                this.setProperty("lastName", data.lastName);
                this.setProperty("status", data.status);
            }
        },

        /**
         * @protected
         * @param {string} key
         * @param {MeldDocument} meldDocument
         */
        unprocessMeldDocument: function(key, meldDocument) {
            this._super();
            if (key === "roomMember") {
                this.removeProperty("id");
                this.removeProperty("roomId");
                this.removeProperty("userId");
            } else if (key === "user") {
                this.removeProperty("firstName");
                this.removeProperty("lastName");
                this.removeProperty("status");
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

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
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomMemberModel", RoomMemberModel);
});
