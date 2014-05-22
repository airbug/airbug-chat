//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BoxWithFooterView')

//@Require('Class')
//@Require('airbug.BoxView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var BoxView         = bugpack.require('airbug.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var BoxWithFooterView = Class.extend(BoxView, {

        _name: "airbug.BoxWithFooterView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="box-{{cid}}" class="box box-with-footer {{classes}}">' +
                '<div id="box-body-{{cid}}" class="box-body">' +
                '</div>' +
                '<div id="box-footer-{{cid}}" class="box-footer">' +
                '</div>' +
            '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BoxWithFooterView", BoxWithFooterView);
});