//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TextAreaView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.KeyBoardEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var TypeUtil        = bugpack.require('TypeUtil');
var KeyBoardEvent   = bugpack.require('airbug.KeyBoardEvent');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TextAreaView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<textarea id="{{id}}" name="{{attributes.name}}" rows="{{attributes.rows}}">{{attributes.placeholder}}</textarea>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.id = this.getId() || "text-area-" + this.getCid();
        if (!TypeUtil.isNumber(data.attributes.rows)) {
            data.attributes.rows = 2;
        }
        return data;
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.on('keydown', function(event) {
            _this.handleKeyDown(event);
        });
        this.$el.on('keypress', function(event) {
            _this.handleKeyPress(event);
        });
        this.$el.on('keyup', function(event) {
            _this.handleKeyUp(event);
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @returns {*}
     */
    getValue: function() {
        return this.$el.val();
    },

    /**
     * @param {*} value
     */
    setValue: function(value) {
        this.$el.val(value);
    },


    //-------------------------------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleKeyDown: function(event) {
        this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_DOWN, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey));
    },

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleKeyPress: function(event) {
        this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_PRESS, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey));
    },

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleKeyUp: function(event) {
        this.dispatchEvent(new KeyBoardEvent(KeyBoardEvent.EventTypes.KEY_UP, event.keyCode, event.ctrlKey, event.shiftKey, event.altKey));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.TextAreaView", TextAreaView);
