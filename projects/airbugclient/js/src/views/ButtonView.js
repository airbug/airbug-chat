//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ButtonView')

//@Require('ButtonTemplate')
//@Require('ButtonViewEvent')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: HomeButtonTemplate,

    /**
     * @protected
     */
    deinitialize: function() {
        this._super();
        this.$el.find('button-' + this.cid).unbind();
    },

    /**
     * @protected
     */
    initialize: function() {
        this._super();
        var _this = this;
        this.$el.find('#button-' + this.cid).bind('click', function(event) {
            _this.handleButtonClick(event);
        })
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventTypes.CLICKED));
    }
});
