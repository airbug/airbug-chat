//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.LinkView')

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

var LinkView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<a id="link-{{cid}}" class="{{classes}}" href="{{href}}">{{text}}</span>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getLinkElement: function() {
        return this.$el;
    },


    //-------------------------------------------------------------------------------
    // BugView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    renderView: function() {
        this._super();
        var data = this.generateTemplateData();
        this.$el.text(data.text);
        this.$el.attr("href", data.href);
    },


    //-------------------------------------------------------------------------------
    // MustacheView Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.href   = this.getHref();
        data.text   = this.getText();
        return data;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getHref: function() {
        return this.getAttribute("href");
    },

    /**
     * @param {string} href
     */
    setHref: function(href) {
        this.setAttribute("href", href);
    },
    
    /**
     * @return {string}
     */
    getText: function() {
        return this.getAttribute("text");
    },

    /**
     * @param {string} text
     */
    setText: function(text) {
        this.setAttribute("text", text);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LinkView", LinkView);
