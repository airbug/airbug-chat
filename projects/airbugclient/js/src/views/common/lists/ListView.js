//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ListView')

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

var ListView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="list-{{cid}}" class="list">' +
            '<div id="list-view-placeholder-{{cid}}" class="list-placeholder">{{placeholder}}</div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getListElement: function() {
        return this.findElement("#list-{{cid}}");
    },

    /**
     * @return {$}
     */
    getPlaceholderElement: function() {
        return this.findElement("#list-view-placeholder-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // Mustache Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        var placeholder     = this.getAttribute("placeholder");
        if (placeholder) {
            data.placeholder    = placeholder;
        } else {
            data.placeholder    = "";
        }
        return data;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    hidePlaceholder: function() {
        this.getPlaceholderElement().hide();
    },

    /**
     *
     */
    showPlaceholder: function() {
        this.getPlaceholderElement().show();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ListView", ListView);
