//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ConversationModel')

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
    var ConversationModel = Class.extend(MeldModel, /** @lends {ConversationModel.prototype} */{

        _name: "airbug.ConversationModel",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocument}
         */
        getConversationMeldDocument: function() {
            return this.getMeldDocument();
        },

        /**
         * @param {MeldDocument} conversationMeldDocument
         */
        setConversationMeldDocument: function(conversationMeldDocument) {
            this.setMeldDocument(conversationMeldDocument)
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
                    .in(["id", "ownerId"])
                    .call(this.hearMeldPropertySetChange, this);
                this.getMeldDocument()
                    .on(MeldDocumentEvent.EventTypes.CHANGE)
                    .where("data.changeType")
                    .in([MeldDocument.ChangeTypes.PROPERTY_REMOVED])
                    .where("data.deltaChange.propertyName")
                    .in(["id", "ownerId"])
                    .call(this.hearMeldPropertyRemovedChange, this);
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
            this.setProperty("ownerId", data.ownerId);
        },

        /**
         * @protected
         */
        unprocessMeldDocument: function() {
            this._super();
            this.removeProperty("id");
            this.removeProperty("ownerId");
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

    bugpack.export("airbug.ConversationModel", ConversationModel);
});
