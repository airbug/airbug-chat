//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CopyToClipboardButtonView')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ButtonViewEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var ButtonViewEvent = bugpack.require('airbug.ButtonViewEvent');
    var ButtonView      = bugpack.require('airbug.ButtonView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonView}
     */
    var CopyToClipboardButtonView = Class.extend(ButtonView, {

        _name: "airbug.CopyToClipboardButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        /**
         *
         */
        template:   '<div class="button-wrapper {{classes}}">' +
                        '<button id="button-{{cid}}" class="copy-to-clipboard btn {{buttonClasses}}"></button>' +
                    '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CopyToClipboardButtonView", CopyToClipboardButtonView);
});
