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

var Class           = bugpack.require('Class');
var Publisher       = bugpack.require('Publisher');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CommandModule = Class.extend(Publisher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} topic
     * @param {*} data
     */
    relayCommand: function(topic, data) {
        this.publish(topic, data);
    },

    /**
     * @param {string} topic
     * @param {*} data
     */
    relayMessage: function(topic, data) {
        this.publish(topic, data);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
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
        IMAGE_EDITOR:           "CommandModuleCommand::display::imageEditor",
        IMAGE_LIST:             "CommandModuleCommand::display::imageList",
        IMAGE_UPLOAD:           "CommandModuleCommand::display::imageUpload"
    },
    HIDE: {
        WORKSPACE:              "CommandModuleCommand::hide::workspace"
    },
    SUBMIT: {
        CHAT_MESSAGE:            "CommandmoduleCommand::submit::chatMessage"
    }
};

/**
 * @static
 * @enum {string}
 */
CommandModule.MessageType = {
    BUTTON_CLICKED:             "CommandModuleMessage::ButtonClicked"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CommandModule", CommandModule);
