//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MultiColumnView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MultiColumnView     = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data      = this._super();
        data.rowStyle = "row";

        switch (this.attributes.rowStyle) {
            case MultiColumnView.RowStyle.FLUID:
                data.rowStyle = "row-fluid";
                break;
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Static Properites
//-------------------------------------------------------------------------------

/**
 * @enum {number}
 */
MultiColumnView.RowStyle = {
    DEFAULT: 1,
    FIXED: 1,
    FLUID: 2
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MultiColumnView", MultiColumnView);
