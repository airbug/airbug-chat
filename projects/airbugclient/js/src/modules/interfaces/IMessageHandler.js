//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.IMessageHandler')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     */
    var IMessageHandler = Interface.declare({

        _name: "airbug.IMessageHandler",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        doesSupportEmbed: function() {},

        /**
         * @return {boolean}
         */
        doesSupportSend: function() {},

        /**
         * @param {*} messagePartObject
         */
        embedMessagePart: function(messagePartObject) {},

        /**
         * @param {*} messageObject
         */
        sendMessage: function(messageObject) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbug.IMessageHandler', IMessageHandler);
});
