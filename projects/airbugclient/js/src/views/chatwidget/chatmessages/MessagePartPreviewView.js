//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MessagePartPreviewView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var MessagePartPreviewView = Class.extend(MustacheView, {
        _name: "airbug.MessagePartPreviewView"
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartPreviewView", MessagePartPreviewView);
});
