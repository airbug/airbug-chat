//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.PanelView')

//@Require('Class')
//@Require('TypeUtil')
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
    var TypeUtil        = bugpack.require('TypeUtil');
    var MustacheView    = bugpack.require('airbug.MustacheView');
    var ScrollEvent     = bugpack.require('airbug.ScrollEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var PanelView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="{{id}}-wrapper" class="panel-wrapper {{classes}}">' +
                        '<div id="{{id}}" class="panel">' +
                            '<div id="panel-body-{{cid}}" class="panel-body panel-body-no-header">' +
                            '</div>' +
                        '</div>' +
                    '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {$}
         */
        getPanelBodyElement: function() {
            return this.findElement("#panel-body-" + this.getCid());
        },


        //-------------------------------------------------------------------------------
        // MustacheView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @returns {*}
         */
        generateTemplateData: function() {
            var data    = this._super();
            data.id     = this.getId() || "panel-" + this.getCid();
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
            this.getPanelBodyElement().off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this       = this;
            this.getPanelBodyElement().scroll(function(event) {
                _this.dispatchEvent(new ScrollEvent(ScrollEvent.EventType.SCROLL, _this.getPanelBodyElement().scrollTop()));
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PanelView", PanelView);
});
