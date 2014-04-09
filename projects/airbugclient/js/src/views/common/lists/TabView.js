//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.TabView')

//@Require('Class')
//@Require('airbug.MustacheView')
//@Require('airbug.TabViewEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');
var TabViewEvent    = bugpack.require('airbug.TabViewEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TabView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<li id="{{id}}" class="{{classes}}">' +
            '<a>' +
            '</a>' +
        '</li>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "tab-" + this.cid;
        return data;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getTabElement: function() {
        return this.$el;
    },

    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.getTabElement().off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.getTabElement().on('click', function(event) {
            _this.handleTabClick(event);
        });
    },

    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleTabClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new TabViewEvent(TabViewEvent.EventType.CLICKED, {}));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TabView", TabView);
