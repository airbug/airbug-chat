//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CommandModule')

//@Require('Class')
//@Require('Publisher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Publisher   = bugpack.require('Publisher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CommandModule = Class.extend(Publisher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     */
    _constructor: function() {
        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    relayCommand: function(topic, data){
        this.publish(topic, data);
    },

    relayMessage: function(topic, data){
        this.publish(topic, data);
    }
});

/**
 * @enum {string}
 */
CommandModule.CommandType = {
    TOGGLE: {
        HAMBURGER_LEFT:         "CommandModuleCommand::toggle::hamburgerLeft",
        HAMBURGER_RIGHT:        "CommandModuleCommand::toggle::hamburgerRight",
        CODE_EDITOR_SETTINGS:   "CommandModuleCommand::toggle::codeEditorSettings",
        WORKSPACE:              "CommandModuleCommand::toggle::workspace"
    },
    DISPLAY: {
        CODE:                   "CommandModuleCommand::display::code",
        CODE_EDITOR:            "CommandModuleCommand::display::codeEditor",
        PICTURE_EDITOR:         "CommandModuleCommand::display::pictureEditor"
    },
    SUBMIT: {
        CHATMESSAGE:            "CommandmoduleCommand::submit::chatMessage"
    }
};

/**
 * @enum {string}
 */
CommandModule.MessgeType = {
    BUTTON_CLICKED:             "CommandModuleMessage::ButtonClicked"
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CommandModule", CommandModule);
