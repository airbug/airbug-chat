//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageStreamManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.ChatMessageStream')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var ChatMessageStream           = bugpack.require('airbugserver.ChatMessageStream');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var ModuleTag            = bugpack.require('bugioc.ModuleTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var module                      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ChatMessageStreamManager = Class.extend(Obj, {

        _name: "airbugserver.ChatMessageStreamManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      id: string
         * }} data
         * @return {ChatMessageStream}
         */
        generateChatMessageStream: function(data) {
            var chatMessageStream = new ChatMessageStream(data);
            chatMessageStream.setEntityType("ChatMessageStream");
            return chatMessageStream;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageStreamManager).with(
        module("chatMessageStreamManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageStreamManager', ChatMessageStreamManager);
});
