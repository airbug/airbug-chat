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

//@Export('airbug.OverlayViewEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class = bugpack.require('Class');
    var Event = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Event}
     */
    var OverlayViewEvent = Class.extend(Event, {
        _name: "airbug.OverlayViewEvent"
    });


    //-------------------------------------------------------------------------------
    // Static Variables
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    OverlayViewEvent.EventType = {
        CLOSE: "OverlayViewEvent:Close"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.OverlayViewEvent", OverlayViewEvent);
});