//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImageViewEvent')

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

var ImageViewEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
ImageViewEvent.EventType = {
    CLICKED_DELETE: "ImageViewEvent:ClickedDelete",
    CLICKED_EDIT:   "ImageViewEvent:ClickedEdit",
    CLICKED_EMBED:  "ImageViewEvent:ClickedEmbed",
    CLICKED_SAVE:   "ImageViewEvent:ClickedSave",
    CLICKED_SEND:   "ImageViewEvent:ClickedSend",
    CLICKED_TINKER: "ImageViewEvent:ClickedEdit"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageViewEvent", ImageViewEvent);
