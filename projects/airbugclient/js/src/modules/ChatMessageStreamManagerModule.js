//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageStreamManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.ChatMessageStreamModel')
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
var ChatMessageStreamModel          = bugpack.require('airbug.ChatMessageStreamModel');
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

var ChatMessageStreamManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} dataObject
     * @param {MeldDocument=} meldDocument
     * @returns {ChatMessageStreamModel}
     */
    generateChatMessageStreamModel: function(dataObject, meldDocument) {
        return new ChatMessageStreamModel(dataObject, meldDocument);
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveChatMessageStream: function(conversationId, callback) {
        this.retrieve("ChatMessageStream", conversationId, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageStreamManagerModule).with(
    module("chatMessageStreamManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageStreamManagerModule", ChatMessageStreamManagerModule);
