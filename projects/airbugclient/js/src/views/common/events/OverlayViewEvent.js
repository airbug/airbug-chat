//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('OverlayViewEvent')

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

var OverlayViewEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
OverlayViewEvent.EventType = {
    CLOSE: "OverlayViewEvent:Close"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.OverlayViewEvent", OverlayViewEvent);
