//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MessagePartPreviewCodeView')

//@Require('Class')
//@Require('airbug.MessagePartPreviewView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var MessagePartPreviewView  = bugpack.require('airbug.MessagePartPreviewView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartPreviewView}
     */
    var MessagePartPreviewCodeView = Class.extend(MessagePartPreviewView, {

        _name: "airbug.MessagePartPreviewCodeView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="message-part-preview-{{cid}}" class="message-part-preview message-part-preview-code">' +
                '<pre><code id="code-{{cid}}" class="{{model.codeLanguage}}">{{model.code}}</code></pre>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getCodeElement: function() {
            return this.findElement("#code-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createView: function() {
            this._super();
            var codeBlock = this.getCodeElement().get()[0];
            if (codeBlock) {
                hljs.highlightBlock(codeBlock);
            }
        },

        /**
         * @protected
         * @param {string} propertyName
         * @param {string} propertyValue
         */
        renderModelProperty: function(propertyName, propertyValue) {
            this._super(propertyName, propertyValue);
            switch (propertyName) {
                case "code":
                    var codeElement = this.getCodeElement();
                    codeElement.text(propertyValue);
                    var codeBlock = codeElement.get()[0];
                    if (codeBlock) {
                        hljs.highlightBlock(codeBlock);
                    }
                    break;
                case "codeLanguage":
                    this.getCodeElement().removeClass();
                    this.getCodeElement().addClass(propertyValue);
                    break;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartPreviewCodeView", MessagePartPreviewCodeView);
});
