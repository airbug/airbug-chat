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

var ChatWidgetInputFormView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
                        '<form id="chat-widget-input-form-{{cid}}" class="form-horizontal">' +
                            '<div class="control-group">' +
                                '<textarea form="chat-widget-input-form-{{cid}}" id="text-area-{{cid}}" rows="{{attributes.rows}}">{{attributes.placeholder}}</textarea>' +
                            '</div>' +
                            '<div class="control-group">' +
                                '<button id="submit-button-{{cid}}" type="button" class="btn">Send</button>' +
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
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('#submit-button-' + this.cid).on('click', function(event){
            _this.handleButtonClick(event);
        });
        this.$el.find('#text-area-' + this.cid).on('keypress', function(event) {
            console.log("hearing keypress");
            // _this.handleKeyPress(event);
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
     * @private
     * @param event
     */
    handleKeyPress: function(event) {
        event.preventDefault();
        if(event.which === 13 && !event.ctrlKey){
            this.submitForm();
        }
    },

    handleButtonClick: function(event){
        event.preventDefault();
        this.submitForm();
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.ChatWidgetInputFormView', ChatWidgetInputFormView);
