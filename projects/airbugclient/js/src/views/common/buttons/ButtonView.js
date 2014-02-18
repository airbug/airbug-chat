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

var Class           = bugpack.require('Class');
var ButtonViewEvent = bugpack.require('airbug.ButtonViewEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {MustacheView}
 */
var ButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="{{id}}-wrapper" class="button-wrapper {{classes}}">' +
        '<button id="button-{{cid}}" class="btn {{buttonClasses}}"></button>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {$}
     */
    getButtonElement: function() {
        return this.findElement("#button-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.getButtonElement().off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.getButtonElement().on('click', function(event) {
            _this.handleButtonClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} attributeName
     * @param {*} attributeValue
     */
    renderAttribute: function(attributeName, attributeValue) {
        switch (attributeName) {
            case "active":
                if (attributeValue) {
                    this.getButtonElement().addClass("active");
                } else {
                    this.getButtonElement().removeClass("active");
                }
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // MustacheView Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.buttonClasses = this.getAttribute("buttonClasses") || "";
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
            case "default":
                break;
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
            case "inverse":
                data.buttonClasses += " btn-inverse";
                break;
            case "link":
                data.buttonClasses += " btn-link";
                break;
        }
        if (this.getAttribute("active")) {
            data.buttonClasses += " active";
        }
        if (this.getAttribute("block")) {
            data.buttonClasses += " btn-block";
        }
        if (this.getAttribute("disabled")) {
            data.buttonClasses += " disabled";
        }

        switch (this.attributes.align) {
            case "right":
                data.classes += "pull-right";
                break;
        }

        return data;
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED, {}));
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {number}
 */
ButtonView.Size = {
    LARGE: 1,
    NORMAL: 2,
    SMALL: 3,
    MINI: 4
};

/**
 * @static
 * @enum {string}
 */
ButtonView.Type = {
    DEFAULT:    "default",
    PRIMARY:    "primary",
    INFO:       "info",
    SUCCESS:    "sucess",
    WARNING:    "warning",
    DANGER:     "danger",
    INVERSE:    "inverse",
    LINK:       "link"
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ButtonView", ButtonView);
