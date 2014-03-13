//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeViewEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Event = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeViewEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
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

bugpack.export("airbug.CodeViewEvent", CodeViewEvent);
