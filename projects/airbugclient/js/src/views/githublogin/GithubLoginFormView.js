//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('GithubLoginFormView')

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

var GithubLoginFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="form-wrapper">' +
        '<form class="form-horizontal">' +
        '<div class="control-group">' +
        'We noticed that your GitHub email address ' +
        '</div>' +
        '<div class="control-group">' +
        '<input class="input-xxlarge" type="text" name="email" placeholder="Email">' + // TODO - dkk - change this so it is radio buttons
        '</div>' +
        '<div class="control-group">' +
        '<input class="input-xxlarge" type="password" name="password" placeholder="Password">' +
        '</div>' +
        '<div class="control-group">' +
        '<button id="login-button-{{cid}}" type="submit" class="btn">Login</button>' +
        '</div>' +
        '</form>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.find('login-button-' + this.cid).unbind();
        this.$el.find('form').off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('form').on('submit', function(event) {
            _this.handleSubmit(event);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
        this.$el.find('#login-button-' + this.cid).bind('click', function(event) {
            _this.handleSubmit(event);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Object}
     */
    getFormData: function() {

        // TODO BRN: This won't work for multiple check boxes. Will need to improve this if we have a form with more than
        // one checkbox.

        var formData = {};
        var formInputs = this.$el.find("form").serializeArray();
        formInputs.forEach(function(formInput) {
            formData[formInput.name] = formInput.value;
        });
        return formData;
    },

    /**
     * @protected
     */
    submitForm: function() {
        var formData = this.getFormData();
        console.log("formData:", formData);
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, {
            formData: formData
        }));
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleSubmit: function(event) {
        this.submitForm();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.GithubLoginFormView", LoginFormView);