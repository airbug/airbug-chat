//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationFormView')

//@Require('Class')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RegistrationFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: 	    
                    '<div class="form-wrapper">' +
                        '<div class=""> Welcome </div>' +
                        '<form class="form-horizontal">' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="text" name="email" placeholder="Email">' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="text" name="firstName" placeholder="First Name">' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<input class="input-xxlarge" type="text" name="lastName" placeholder="Last Name">' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<button id="submit-button-{{cid}}" type="submit" class="btn">Enter</button>' +
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
        this.$el.find('#submit-button-' + this.cid).off();
        this.$el.find('form').off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('form').on('keypress', function(event){
            this.handleKeypress(event);
        });
        this.$el.find('form').on('submit', function(event){
            _this.handleSubmit(event);
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
        this.$el.find('#submit-button-' + this.cid).on('click', function(event) {
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
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, formData));
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
    },

    handleKeypress: function(event) {
        var formData = this.getFormData();
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.KEYPRESS, formData));
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.RegistrationFormView', RegistrationFormView);
