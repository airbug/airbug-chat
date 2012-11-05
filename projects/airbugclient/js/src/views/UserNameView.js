//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserNameView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserNameView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<span id="user-name-{{cid}}" class="text user-name">{{model.firstName}} {{model.lastName}}</span>',


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
            case "firstName":
            case "lastName":
                this.findElement('#user-name-' + this.cid).text(this.model.firstName + " " + this.model.lastName);
                break;
        }
    }
});
