//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConversationPanelEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationPanelEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
ConversationPanelEvent.EventTypes = {
    CONVERSATION_SELECTED: "ConversationPanelEvent:ConversationSelected"
};
