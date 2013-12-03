//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationManagerModule')

//@Require('Class')
//@Require('airbug.ConversationList')
//@Require('airbug.ConversationModel')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ConversationList        = bugpack.require('airbug.ConversationList');
var ConversationModel       = bugpack.require('airbug.ConversationModel');
var ManagerModule           = bugpack.require('airbug.ManagerModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IList=} dataList
     * @return {ConversationList}
     */
    generateConversationList: function(dataList) {
        return new ConversationList(dataList);
    },

    /**
     * @param {Object} dataObject
     * @param {MeldDocument=} conversationMeldDocument
     * @returns {ConversationModel}
     */
    generateConversationModel: function(dataObject, conversationMeldDocument) {
        return new ConversationModel(dataObject, conversationMeldDocument);
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveConversation: function(conversationId, callback) {
        this.retrieve("Conversation", conversationId, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationManagerModule", ConversationManagerModule);
