//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ButtonView')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var ButtonViewEvent =   bugpack.require('airbug.ButtonViewEvent');
var MustacheView =      bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="button-wrapper {{buttonWrapperClasses}}">' +
                    '<button id="button-{{cid}}" class="btn {{buttonClasses}}"></button>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.find('button-' + this.cid).unbind();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.find('#button-' + this.cid).bind('click', function(event) {
            _this.handleButtonClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.buttonClasses = "";
        switch (this.attributes.size) {
            case ButtonView.Size.LARGE:
                data.buttonClasses += " btn-large";
                break;
            case ButtonView.Size.SMALL:
                data.buttonClasses += " btn-small";
                break;
            case ButtonView.Size.MINI:
                data.buttonClasses += " btn-mini";
                break;
        }
        switch (this.attributes.type) {
            case "primary":
                data.buttonClasses += " btn-primary";
                break;
            case "info":
                data.buttonClasses += " btn-info";
                break;
            case "success":
                data.buttonClasses += " btn-success";
                break;
            case "warning":
                data.buttonClasses += " btn-warning";
                break;
            case "danger":
                data.buttonClasses += " btn-danger";
                break;
            case "link":
                data.buttonClasses += " btn-link";
                break;
        }

        data.buttonWrapperClasses = "";
        switch (this.attributes.align) {
            case "right":
                data.buttonWrapperClasses += "pull-right";
                break;
        }

        return data;
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED));
    }
});

/**
 * @enum {number}
 */
ButtonView.Size = {
    LARGE: 1,
    NORMAL: 2,
    SMALL: 3,
    MINI: 4
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ButtonView", ButtonView);
