/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CommandModule')
//@Autoload

//@Require('Class')
//@Require('Publisher')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Publisher   = bugpack.require('Publisher');
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Publisher}
     */
    var CommandModule = Class.extend(Publisher, {

        _name: "airbug.CommandModule",


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
            SET_MODE:               "CommandModuleCommand::codeEditor:setMode",
            SET_TABSIZE:            "CommandModuleCommand::codeEditor:setTabSize",
            SET_TEXT:               "CommandModuleCommand::codeEditor:setText",
            SET_THEME:              "CommandModuleCommand::codeEditor:setTheme"
        },
        TOGGLE: {
            CODE_EDITOR:            "CommandModuleCommand::toggle::codeEditor",
            CODE_EDITOR_SETTINGS:   "CommandModuleCommand::toggle::codeEditorSettings",
            CODE_WORKSPACE:         "CommandModuleCommand::toggle::codeWorkspace",
            HAMBURGER_LEFT:         "CommandModuleCommand::toggle::hamburgerLeft",
            HAMBURGER_RIGHT:        "CommandModuleCommand::toggle::hamburgerRight",
            IMAGE_LIST:             "CommandModuleCommand::toggle::imageList",
            IMAGE_WORKSPACE:        "CommandModuleCommand::toggle::imageWorkspace"
        },
        DISPLAY: {
            CODE:                   "CommandModuleCommand::display::code",
            CODE_EDITOR:            "CommandModuleCommand::display::codeEditor",
            CODE_EDITOR_FULLSCREEN: "CommandModuleCommand::display::codeEditorFullscreen",
            IMAGE_EDITOR:           "CommandModuleCommand::display::imageEditor",
            IMAGE_LIST:             "CommandModuleCommand::display::imageList",
            IMAGE_UPLOAD:           "CommandModuleCommand::display::imageUpload",
            IMAGE_UPLOAD_MODAL:     "CommandModuleCommand::display::imageUploadModal",
            SHARE_ROOM_OVERLAY:     "CommandModuleCommand::display::shareRoomOverlay"
        },
        HIDE: {
            SHARE_ROOM_OVERLAY:     "CommandModuleCommand::hide::shareRoomOverlay",
            CODE_EDITOR_FULLSCREEN: "CommandModuleCommand::hide::codeEditorFullscreen"
        },
        FLASH: {
            ERROR:                  "CommandModuleCommand::flash::error",
            EXCEPTION:              "CommandModuleCommand::flash::exception",
            MESSAGE:                "CommandModuleCommand::flash::message",
            SUCCESS:                "CommandModuleCommand::flash::success"
        },
        SAVE: {
            TO_IMAGE_LIST:          "CommandModuleCommand::save::toImageList"
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

    bugmeta.tag(CommandModule).with(
        module("commandModule")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CommandModule", CommandModule);
});
