//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatWidgetView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var ChatWidgetView = Class.extend(MustacheView, {

        _name: "airbug.ChatWidgetView",


        //-------------------------------------------------------------------------------
        // Mustache Properties
        //-------------------------------------------------------------------------------

        attributes: {
            inputSize: "InputSize:Small"
        },

        template:
            '<div id="chat-widget-{{cid}}" class="chat-widget {{classes}}">' +
                '<div id="chat-widget-messages-{{cid}}" class="chat-widget-messages image-upload-dropzone {{messagesSize}}">' +
                '</div>' +
                '<div id="chat-widget-input-{{cid}}" class="chat-widget-input {{inputSize}}">' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getChatWidgetInputElement: function() {
            return this.findElement("#chat-widget-input-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getChatWidgetMessagesElement: function() {
            return this.findElement("#chat-widget-messages-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {
            switch (attributeName) {
                case "inputSize":
                    this.getChatWidgetInputElement().removeClass("chat-widget-input-large chat-widget-input-small");
                    this.getChatWidgetMessagesElement().removeClass("chat-widget-messages-large chat-widget-messages-small");
                    if  (attributeValue === ChatWidgetView.InputSize.LARGE) {
                        this.getChatWidgetInputElement().addClass("chat-widget-input-large");
                        this.getChatWidgetMessagesElement().addClass("chat-widget-messages-small");
                    } else {
                        this.getChatWidgetInputElement().addClass("chat-widget-input-small");
                        this.getChatWidgetMessagesElement().addClass("chat-widget-messages-large");
                    }
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // Mustache Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            var inputSize = this.getAttribute("inputSize");
            switch (inputSize) {
                case ChatWidgetView.InputSize.LARGE:
                    data.inputSize = "chat-widget-input-large";
                    data.messagesSize = "chat-widget-messages-small";
                    break;
                case ChatWidgetView.InputSize.SMALL:
                    data.inputSize = "chat-widget-input-small";
                    data.messagesSize = "chat-widget-messages-large";
                    break;
            }
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ChatWidgetView.InputSize = {
        LARGE: "InputSize:Large",
        SMALL: "InputSize:Small"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatWidgetView", ChatWidgetView);
});
