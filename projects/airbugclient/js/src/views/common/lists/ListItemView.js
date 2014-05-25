//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ListItemView')

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
var ListItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<div id="list-item-{{cid}}" class="list-item list-item-{{attributes.size}} {{classes}}">' +
              '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    attributes: {
        size: "small"
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {jQuery}
     */
    getListItemElement: function() {
        return this.findElement("#list-item-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // BugView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} attributeName
     * @param {*} attributeValue
     */
    renderAttribute: function(attributeName, attributeValue) {
        switch (attributeName) {
            case "active":
                if (attributeValue) {
                    this.getListItemElement().addClass("active");
                } else {
                    this.getListItemElement().removeClass("active");
                }
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // Mustache Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        var size            = this.getAttribute("size");
        switch (size) {
            case ListItemView.Size.FLEX:
                data.classes += "list-item-flex";
                break;
            case ListItemView.Size.LARGE:
                data.classes += "list-item-large";
                break;
            case ListItemView.Size.MICRO:
                data.classes += "list-item-micro";
                break;
            case ListItemView.Size.SMALL:
                data.classes += "list-item-small";
                break;
        }
        if (this.getAttribute("active")) {
            data.buttonClasses += " active";
        }
        return data;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    activateItem: function() {
        this.setAttribute("active", true);
    },

    /**
     *
     */
    deactivateItem: function() {
        this.setAttribute("active", false);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
ListItemView.Size = {
    FLEX: "flex",
    LARGE: "large",
    MICRO: "micro",
    SMALL: "small"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ListItemView", ListItemView);
