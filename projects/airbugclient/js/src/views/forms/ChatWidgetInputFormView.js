//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetInputFormView')

//@Require('Class')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetInputFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
                        '<form id="chat-widget-input-form-{{cid}}" class="form-horizontal">' +
                            '<div class="control-group control-group-textarea">' +
                                '<textarea form="chat-widget-input-form-{{cid}}" id="text-area-{{cid}}" rows="{{attributes.rows}}">{{attributes.placeholder}}</textarea>' +
                            '</div>' +
                            '<div class="control-group control-group-checkbox">' +
                                '<input id="submit-on-enter-toggle-{{cid}}" type="checkbox" checked="checked" class="checkbox"> Press enter to send</button>' +
                            '</div>' +
                        '</form>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.find('#text-area-' + this.cid).off();
        this.$el.find('form').off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('#text-area-' + this.cid).on('keypress', function(event){
            _this.handleKeyPress(event);
        });
        this.$el.find('form').on('submit', function(event){
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
        var value = this.$el.find("textarea").val();
        formData.body = value;
        return formData;
    },

    /**
     * @protected
     */
    submitForm: function() {
        var formData = this.getFormData();
        console.log("formData:", formData);
        this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.SUBMIT, formData));
        this.$el.find('#text-area-' + this.cid).val("");
    },

    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {jQuery.Event} event
     */
    handleEnterKeyPress: function(event) {
        var submitOnEnter = this.$el.find("#submit-on-enter-toggle-" + this.cid).prop("checked");
        if(submitOnEnter) {
            this.submitForm();
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    },

    /**
     * @param {jQuery.Event} event
     */
    handleKeyPress: function(event) {
        var key = event.which;
        var ctl = event.ctrlKey;
        if(key === 13 && !ctl){
            this.handleEnterKeyPress(event);
        }
    },

    /**
     * @param {jQuery.Event} event
     */
    handleSubmit: function(event){
        this.submitForm();
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.ChatWidgetInputFormView', ChatWidgetInputFormView);
