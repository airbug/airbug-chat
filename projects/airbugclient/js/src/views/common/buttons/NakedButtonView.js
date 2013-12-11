//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NakedButtonView')

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
var NakedButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} options
     */
    _constructor: function(options) {

        this._super(options);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        if (!this.id) {
            this.id = "button-" + this.cid;
        }
    },


    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<button id="{{id}}" class="btn {{buttonClasses}}"></button>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.findElement('#' + this.getId()).off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.findElement('#' + this.getId()).on('click', function(event) {
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
        data.id = this.getId();
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
            case "link":
                data.buttonClasses += " btn-link";
                break;
        }
        switch (this.attributes.align) {
            case "right":
                data.buttonClasses += " pull-right";
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
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED));
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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NakedButtonView", NakedButtonView);
