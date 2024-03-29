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

//@Export('airbug.CodeEditorViewEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Event           = bugpack.require('Event');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorViewEvent = Class.extend(Event, {});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
CodeEditorViewEvent.EventType = {
    SELECTION_CHANGED: "CodeEditorViewEvent:SelectionChanged"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorViewEvent", CodeEditorViewEvent);
