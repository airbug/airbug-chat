//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SelectableListItemView')

//@Require('Class')
//@Require('airbug.ListItemView')
//@Require('airbug.ListViewEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ListItemView    = bugpack.require('airbug.ListItemView');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SelectableListItemView = Class.extend(ListItemView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="list-item-{{cid}}" class="list-item list-item-{{attributes.size}} clickable-box" data-trackingClasses={{attributes.trackingClasses}}>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.unbind();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleListItemClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleListItemClick: function(event) {
        event.preventDefault();
        var modelData = this.model ? this.model.toJSON() : {};
        this.dispatchEvent(new ListViewEvent(ListViewEvent.EventType.ITEM_SELECTED, modelData));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SelectableListItemView", SelectableListItemView);
