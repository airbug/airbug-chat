//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelView')

//@Require('Class')
//@Require('ContactPanelItemView')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: contactpanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.collection.bind('add', function(contactModel) {
            _this.processCollectionAdd(contactModel);
        });
    },

    /**
     * @param {ContactModel} contactModel
     */
    processCollectionAdd: function(contactModel) {
        var contactPanelItemView = new ContactPanelItemView({
            model: contactModel
        });
        this.addViewChild(contactPanelItemView, "#contact-panel-body");
    }
});
