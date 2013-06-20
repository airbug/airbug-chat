//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('IconView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IconView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<i class="icon-{{attributes.type}} {{iconColorClass}}"></i>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.iconColorClass = "";
        switch (this.attributes.color) {
            case IconView.Color.WHITE:
                data.iconColorClass += "icon-white";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
IconView.Color = {
    BLACK: 1,
    WHITE: 2
};

/**
 * @enum {string}
 */
IconView.Type = {
    CHEVRON_LEFT: "chevron-left",
    USER: "user"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.IconView", IconView);
