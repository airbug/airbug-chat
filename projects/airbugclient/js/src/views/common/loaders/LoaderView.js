//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.LoaderView')

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

/**
 * @class
 * @extends {MustacheView}
 */
var LoaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="loader-{{cid}}" class="loader {{classes}}">' +
                        '<img class="loader-image" src="{{{staticUrl}}}/img/loader.gif">' +
                        '</img>' +
                '</div>',



    //-------------------------------------------------------------------------------
    // MustacheView Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        switch (this.getAttribute("size")) {
            case LoaderView.Size.SMALL:
                data.classes += "loader-small";
                break;
            case LoaderView.Size.MEDIUM:
                data.classes += "loader-medium";
                break;
            case LoaderView.Size.LARGE:
                data.classes += "loader-large";
                break;
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {number}
 */
LoaderView.Size = {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LoaderView", LoaderView);
