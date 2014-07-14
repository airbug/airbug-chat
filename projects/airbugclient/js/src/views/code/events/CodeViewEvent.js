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

    var Class   = bugpack.require('Class');
    var Event   = bugpack.require('Event');


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
