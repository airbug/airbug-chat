//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CommandModule')
//@Autoload

//@Require('Class')
//@Require('Publisher')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Publisher                       = bugpack.require('Publisher');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CommandModule = Class.extend(Publisher, {

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
    CODE_EDITOR: {
        SET_MODE:       "CommandModuleCommand::codeEditor:setMode",
        SET_TABSIZE:    "CommandModuleCommand::codeEditor:setTabSize",
        SET_TEXT:       "CommandModuleCommand::codeEditor:setText",
        SET_THEME:      "CommandModuleCommand::codeEditor:setTheme"

    },
    TOGGLE: {
        HAMBURGER_LEFT:         "CommandModuleCommand::toggle::hamburgerLeft",
        HAMBURGER_RIGHT:        "CommandModuleCommand::toggle::hamburgerRight",
        CODE_EDITOR_SETTINGS:   "CommandModuleCommand::toggle::codeEditorSettings",
        WORKSPACE:              "CommandModuleCommand::toggle::workspace"
    },
    DISPLAY: {
        CODE:                   "CommandModuleCommand::display::code",
        CODE_EDITOR:            "CommandModuleCommand::display::codeEditor",
        CODE_EDITOR_FULLSCREEN: "CommandModuleCommand::display::codeEditorFullscreen",
        IMAGE_EDITOR:           "CommandModuleCommand::display::imageEditor",
        IMAGE_LIST:             "CommandModuleCommand::display::imageList",
        IMAGE_UPLOAD:           "CommandModuleCommand::display::imageUpload",
        SHARE_ROOM_OVERLAY:     "CommandModuleCommand::display::shareRoomOverlay",
        WORKSPACE:              "CommandModuleCommand::display::workspace"
    },
    HIDE: {
        WORKSPACE:              "CommandModuleCommand::hide::workspace",
        SHARE_ROOM_OVERLAY:     "CommandModuleCommand::hide::shareRoomOverlay",
        CODE_EDITOR_FULLSCREEN: "CommandModuleCommand::hide::codeEditorFullscreen"
    },
    FLASH: {
        ERROR:                  "CommandModuleCommand::flash::error",
        EXCEPTION:              "CommandModuleCommand::flash::exception",
        MESSAGE:                "CommandModuleCommand::flash::message",
        SUCCESS:                "CommandModuleCommand::flash::success"
    },
    SUBMIT: {
        CHAT_MESSAGE:           "CommandModuleCommand::submit::chatMessage"
    },
    ADD: {
        USER_IMAGE_ASSET:       "CommandModuleCommand::add::userImageAsset"
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CommandModule).with(
    module("commandModule")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CommandModule", CommandModule);
