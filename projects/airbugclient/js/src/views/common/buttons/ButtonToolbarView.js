//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ButtonToolbarView')

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
    var ButtonToolbarView = Class.extend(MustacheView, {

        _name: "airbug.ButtonToolbarView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="button-toolbar-{{cid}}" class="btn-toolbar {{classes}}">' +
            '</div>',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            switch (this.attributes.align) {
                case "right":
                    data.classes += "pull-right";
                    break;
            }

            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ButtonToolbarView", ButtonToolbarView);
});
