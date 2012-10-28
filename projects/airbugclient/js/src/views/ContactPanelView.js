//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelView')

//@Require('Class')
//@Require('ContactPanelItemView')
//@Require('ContactPanelTemplate')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ContactPanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.collection.bind('add', function(contactModel) {
            _this.handleCollectionAdd(contactModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ContactModel} contactModel
     */
    handleCollectionAdd: function(contactModel) {
        var contactPanelItemView = new ContactPanelItemView({
            model: contactModel
        });
        this.addViewChild(contactPanelItemView, "#contact-panel-body");
    }
});
