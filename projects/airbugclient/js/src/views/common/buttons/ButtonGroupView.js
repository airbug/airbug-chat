//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ButtonGroupView')

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
    var ButtonGroupView = Class.extend(MustacheView, {

        _name: "airbug.ButtonGroupView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="button-group-{{cid}}" class="btn-group {{classes}}">' +
            '</div>',


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            switch (this.getAttribute("align")) {
                case "right":
                    data.classes += " pull-right";
                    break;
            }

            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ButtonGroupView", ButtonGroupView);
});
