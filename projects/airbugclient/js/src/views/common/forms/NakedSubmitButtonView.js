//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.NakedSubmitButtonView')

//@Require('Class')
//@Require('airbug.NakedButtonView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var NakedButtonView     = bugpack.require('airbug.NakedButtonView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {NakedButtonView}
     */
    var NakedSubmitButtonView = Class.extend(NakedButtonView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<button id="submit-button-{{cid}}" type="submit" class="btn summit-button {{buttonClasses}}">{{buttonName}}</button>',


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data            = this._super();
            data.id             = id;
            data.buttonName     = this.attributes.buttonName;
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NakedSubmitButtonView", NakedSubmitButtonView);
});
