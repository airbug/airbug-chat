//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeViewEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class = bugpack.require('Class');
    var Event = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Event}
     */
    var CodeViewEvent = Class.extend(Event, {
        _name: "airbug.CodeViewEvent"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    CodeViewEvent.EventType = {
        CLICKED_DELETE: "CodeViewEvent:ClickedDelete",
        CLICKED_EDIT:   "CodeViewEvent:ClickedEdit",
        CLICKED_SAVE:   "CodeViewEvent:ClickedSave",
        CLICKED_SEND:   "CodeViewEvent:ClickedSend",
        CLICKED_TINKER: "CodeViewEvent:ClickedEdit"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("carapace.CodeViewEvent", CodeViewEvent);
});
