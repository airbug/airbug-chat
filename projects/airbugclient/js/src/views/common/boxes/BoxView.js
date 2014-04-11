//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BoxView')

//@Require('Class')
//@Require('airbug.MustacheView')
//@Require('airbug.ScrollEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('airbug.MustacheView');
    var ScrollEvent     = bugpack.require('airbug.ScrollEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var BoxView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="box-{{cid}}" class="box {{classes}}">' +
                    '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {$}
         */
        getBoxElement: function() {
            return this.findElement("#box-{{cid}}");
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        generateTemplateData: function() {
            var data    = this._super();
            if (this.getAttribute("scroll")) {
                data.classes += "scroll-box";
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
            this.getBoxElement().off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this       = this;
            this.getBoxElement().scroll(function(event) {
                _this.dispatchEvent(new ScrollEvent(ScrollEvent.EventType.SCROLL, _this.getBoxElement().scrollTop()));
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BoxView", BoxView);
});
