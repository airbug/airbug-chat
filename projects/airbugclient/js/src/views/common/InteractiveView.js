//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('InteractiveView')

//@Require('Class')
//@Require('airbug.MouseEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var MouseEvent          = bugpack.require('airbug.MouseEvent');
var MustacheView        = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {MustacheView}
 */
var InteractiveView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        this._super(options);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        var _this = this;
        this.handleClick = function(event) {
            //event.preventDefault();
            if (!_this.getAttribute("disabled")) {
                _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.CLICK, {}));
            }
        };
        this.handleMousedown = function(event) {
            //event.preventDefault();
            if (!_this.getAttribute("disabled")) {
                _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.DOWN, {}));
            }
        };
        this.handleMouseup = function(event) {
            //event.preventDefault();
            if (!_this.getAttribute("disabled")) {
                _this.dispatchEvent(new MouseEvent(MouseEvent.EventType.UP, {}));
            }
        };
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.off("click", this.handleClick);
        this.$el.off("mousedown", this.handleMousedown);
        this.$el.off("mouseup", this.handleMouseup);
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        this.$el.on("click", this.handleClick);
        this.$el.on("mousedown", this.handleMousedown);
        this.$el.on("mouseup", this.handleMouseup);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    disableView: function() {
        this.setAttribute("disabled", true);
    },

    /**
     *
     */
    enableView: function() {
        this.setAttribute("disabled", false);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.InteractiveView", InteractiveView);
