//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
ContactPanelEvent.EventTypes = {
    CONTACT_SELECTED: "ContactPanelEvent:ContactSelected"
};