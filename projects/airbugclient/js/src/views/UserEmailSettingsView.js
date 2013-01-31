//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserEmailSettingsView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var MustacheView =  bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserEmailSettingsView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

        template:   '<div>' +
                        '<span class="setting-label text">Email:</span>' +
                        '<span id="user-email-{{cid}}" class="text user-email">{{model.email}}</span>' +
                        '<span id="user-email-set-{{cid}}" class="text user-email-set">{{emailSet}}</span>' +
                    '</div>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.emailSet = this.renderEmailSet(this.model.get("emailSet"));
        return data;
    },


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
            case "email":
                this.findElement('#user-email-' + this.cid).text(this.model.get("email"));
                break;
            case "emailSet":
                this.findElement('#user-email-set-' + this.cid).text(this.renderEmailSet(this.model.get("emailSet")));
                break;
        }
    },



    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<string>} emailSet
     * @return {string}
     */
    renderEmailSet: function(emailSet) {
        var emailSetRendering = "";
        var primaryEmail = this.model.email;
        emailSet.forEach(function(email) {
            if (email !== primaryEmail) {
                if (emailSetRendering === "") {
                    emailSetRendering += email;
                } else {
                    emailSetRendering += ", " + email;
                }
            }
        });
        return emailSetRendering;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserEmailSettingsView", UserEmailSettingsView);
