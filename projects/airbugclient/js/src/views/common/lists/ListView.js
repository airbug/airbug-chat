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
        '<div id="{{id}}" class="list">' +
            '<div id="list-view-placeholder-{{cid}}" class="list-placeholder">{{placeholder}}</div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {string}
     */
    getId: function() {
        if (this.id) {
            return this.id;
        }
        return "list-" + this.getCid();
    },

    /**
     * @return {$}
     */
    getListElement: function() {
        return this.findElement("#" + this.getId());
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
        data.id             = this.getId();

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
