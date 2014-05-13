/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


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

        _name: "airbug.PanelView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="panel-wrapper-{{cid}}}}" class="panel-wrapper panel-spacing {{classes}}">' +
                        '<div id="panel-{{cid}}" class="panel">' +
                            '<div id="panel-body-{{cid}}" class="panel-body panel-body-no-header">' +
                            '</div>' +
                        '</div>' +
                    '</div>',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {jQuery}
         */
        getPanelBodyElement: function() {
            return this.findElement("#panel-body-{{cid}}");
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
