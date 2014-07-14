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

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ChatMessageStream   = bugpack.require('airbugserver.ChatMessageStream');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


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
