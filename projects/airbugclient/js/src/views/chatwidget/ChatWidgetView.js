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
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="{{id}}" class="chat-widget">' +
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

    bugpack.export("airbug.ChatWidgetView", ChatWidgetView);
});
