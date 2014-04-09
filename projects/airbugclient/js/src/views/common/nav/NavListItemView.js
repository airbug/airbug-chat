//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.NavListItemView')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.InteractiveView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ButtonViewEvent     = bugpack.require('airbug.ButtonViewEvent');
var InteractiveView     = bugpack.require('airbug.InteractiveView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {InteractiveView}
 */
var NavListItemView = Class.extend(InteractiveView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<li id="nav-list-item-{{cid}}" class="{{classes}}"></li>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getNavListItemElement: function() {
        return this.findElement("#nav-list-item-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
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
                    this.getNavListItemElement().addClass("active");
                } else {
                    this.getNavListItemElement().removeClass("active");
                }
                break;
            case "disabled":
                if (attributeValue) {
                    this.getNavListItemElement().addClass("disabled");
                } else {
                    this.getNavListItemElement().removeClass("disabled");
                }
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // MustacheView Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        if (this.getAttribute("active")) {
            data.classes += " active";
        }
        if (this.getAttribute("disabled")) {
            data.classes += " disabled";
        }
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NavListItemView", NavListItemView);
