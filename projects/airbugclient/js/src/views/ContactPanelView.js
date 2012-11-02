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
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-wrapper panel-wrapper-left">' +
                    '<div class="panel">' +
                        '<div class="panel-header">' +
                            '<span class="panel-header-title">Contacts</span>' +
                            '<span class="panel-header-nav pull-right">' +
                                '<button id="add-contact-button" class="btn btn-small">+</button>' +
                            '</span>' +
                        '</div>' +
                        '<div id="contact-panel-body" class="panel-body">' +
                        '</div>' +
                    '</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeView: function() {
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
