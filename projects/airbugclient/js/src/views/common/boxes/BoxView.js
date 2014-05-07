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

        _name: "airbug.BoxView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        attributes: {
            size: "BoxView:Size:Fill"
        },

        template:
            '<div id="box-{{cid}}" class="box {{classes}}">' +
                '<div id="box-body-{{cid}}" class="box-body">' +
                '</div>' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getBoxBodyElement: function() {
            return this.findElement("#box-body-{{cid}}");
        },

        /**
         * @return {jQuery}
         */
        getBoxElement: function() {
            return this.findElement("#box-{{cid}}");
        },

        /**
         * @return {number}
         */
        getScrollTop: function() {
            return this.getBoxBodyElement().scrollTop();
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
                data.classes += " scroll-box";
            }
            if (this.getAttribute("collapsed")) {
                data.classes += " collapsed-box";
            }

            switch (this.getAttribute("size")) {
                case BoxView.Size.AUTO:
                    data.classes += " auto-box";
                    break;
                case BoxView.Size.FILL:
                    data.classes += " fill-box";
                    break;
            }
            return data;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.getBoxBodyElement().off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this       = this;
            this.getBoxBodyElement().scroll(function(event) {
                _this.dispatchEvent(new ScrollEvent(ScrollEvent.EventType.SCROLL, _this.getBoxBodyElement().scrollTop()));
            });
        },

        /**
         * @protected
         * @param {string} attributeName
         * @param {*} attributeValue
         */
        renderAttribute: function(attributeName, attributeValue) {
            switch (attributeName) {
                case "collapsed":
                    if (attributeValue) {
                        this.getBoxElement().addClass("collapsed-box");
                    } else {
                        this.getBoxElement().removeClass("collapsed-box");
                    }
                    break;
                case "size":
                    this.getBoxElement().removeClass("auto-box fill-box");
                    if (attributeValue === BoxView.Size.AUTO) {
                        this.getBoxElement().addClass("auto-box");
                    } else {
                        this.getBoxElement().addClass("fill-box");
                    }
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {number} value
         * @param {number} duration
         */
        animateScrollTo: function(value, duration) {
            this.getBoxBodyElement().animate({
                scrollTop: value
            }, {
                duration: duration
            });
        },

        /**
         *
         */
        collapse: function() {
            this.setAttribute("collapsed", true);
        },

        /**
         * @param {number} value
         */
        scrollTo: function(value) {
            this.getBoxBodyElement().scrollTop(value);
        },

        /**
         *
         */
        uncollapse: function() {
            this.setAttribute("collapsed", false);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    BoxView.Size = {
        AUTO: "BoxView:Size:Auto",
        FILL: "BoxView:Size:Fill"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BoxView", BoxView);
});
