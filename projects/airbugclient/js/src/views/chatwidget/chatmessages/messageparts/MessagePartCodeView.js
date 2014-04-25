//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MessagePartCodeView')

//@Require('Class')
//@Require('airbug.MessagePartView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var MessagePartView     = bugpack.require('airbug.MessagePartView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartView}
     */
    var MessagePartCodeView = Class.extend(MessagePartView, {

        _name: "airbug.MessagePartCodeView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="message-part-{{cid}}" class="message-code">' +
                        '<pre><code id="code-{{cid}}" class="{{model.codeLanguage}}">{{model.code}}</code></pre>' +
                    '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {$}
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
            var codeBlock = this.getCodeElement().find("pre").get()[0];
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
                    var codeBlock = codeElement.find("pre").get()[0];
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

    bugpack.export("airbug.MessagePartCodeView", MessagePartCodeView);
});
