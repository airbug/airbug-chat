//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.EmbeddedMessagePreviewView')

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
    var EmbeddedMessagePreviewView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="embedded-message-preview-{{cid}}" class="embedded-message-preview">' +
                '<div id="chat-widget-messages-{{cid}}" class="chat-widget-messages image-upload-dropzone">' +
                '</div>' +
                '<div id="chat-widget-input-{{cid}}" class="chat-widget-input">' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Mustache Mehtods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            data.id     = this.getId() || "chat-widget";
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.EmbeddedMessagePreviewView", EmbeddedMessagePreviewView);
});