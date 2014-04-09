//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ConversationManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.ConversationList')
//@Require('airbug.ConversationModel')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ConversationList                = bugpack.require('airbug.ConversationList');
var ConversationModel               = bugpack.require('airbug.ConversationModel');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


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
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveConversation: function(conversationId, callback) {
        this.retrieve("Conversation", conversationId, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ConversationManagerModule).with(
    module("conversationManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationManagerModule", ConversationManagerModule);
