//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.DropdownItemView')

//@Require('Class')
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var DropdownViewEvent   = bugpack.require('airbug.DropdownViewEvent');
    var MustacheView        = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var DropdownItemView = Class.extend(MustacheView, {

        _name: "airbug.DropdownItemView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<li><a id="dropdown-item-{{cid}}" tabindex="-1"></a></li>',


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

            var _this = this;

            /**
             * @private
             * @param {jQuery.Event} event
             */
            this.hearDropdownItemClick = function(event) {
                _this.handleDropdownItemClick(event);
            };
        },


        //-------------------------------------------------------------------------------
        // CarapaceView Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.$el.off('click', this.hearDropdownItemClick);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.$el.on('click', this.hearDropdownItemClick);
        },


        //-------------------------------------------------------------------------------
        // View Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {jQuery.Event} event
         */
        handleDropdownItemClick: function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.dispatchEvent(new DropdownViewEvent(DropdownViewEvent.EventType.DROPDOWN_SELECTED));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.DropdownItemView", DropdownItemView);
});