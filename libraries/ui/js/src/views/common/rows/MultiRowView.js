//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MultiRowView')

//@Require('Class')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var TypeUtil        = bugpack.require('TypeUtil');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var MultiRowView     = Class.extend(MustacheView, {

        _name: "airbug.MultiRowView",


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data      = this._super();
            data.columnStyle = "column";

            switch (this.getAttribute("columnStyle")) {
                case MultiRowView.RowStyle.FLUID:
                    data.columnStyle = "column-fluid";
                    break;
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {jQuery} element
         */
        clearStackClasses: function(element) {
            element.removeClass("stack12 stack11 stack10 stack9 stack8 stack7 stack6 stack5 stack4 stack3 stack2 stack1 stack0");
        },
        
        /**
         * @protected
         * @param {Array.<number>} configArray
         * @param {number} numberRows
         */
        validateConfiguration: function(configArray, numberRows) {
            if (!TypeUtil.isArray(configArray)) {
                throw new Exception("IllegalArgument", {}, "configArray must be an Array");
            }
            if (!TypeUtil.isNumber(numberRows)) {
                throw new Exception("IllegalArgument", {}, "numberRows must be a number");
            }
            var sum = 0;
            for (var i = 0, size = configArray.length; i < size; i++) {
                sum += configArray[i];
            }
            if (sum !== 12) {
                throw new Exception("IllegalAttribute", {}, "Config sum must be 12");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {number}
     */
    MultiRowView.ColumnStyle = {
        DEFAULT: 1,
        FIXED: 1,
        FLUID: 2
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MultiRowView", MultiRowView);
});