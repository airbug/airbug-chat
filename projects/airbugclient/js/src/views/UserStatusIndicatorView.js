//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserStatusIndicatorView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserStatusIndicatorView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<span id="user-status-indicator-{{cid}}" class="user-status-indicator user-status-indicator-{{model.status}}"></span>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} attributeName
     * @param {string} attributeValue
     */
    renderModelAttribute: function(attributeName, attributeValue) {
        this._super(attributeName, attributeValue);
        switch(attributeName) {
            case "status":
                this.findElement('#user-status-indicator-' + this.cid).addClass("user-status-indicator user-status-indicator-" + attributeValue);
                break;
        }
    }
});
