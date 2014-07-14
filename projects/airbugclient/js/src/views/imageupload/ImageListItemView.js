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

//@Export('airbug.ImageListItemView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('carapace.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ImageListItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="image-list-item-{{cid}}" class="image-list-item">' +
            '<div id="image-preview-{{cid}}" class="image-preview">' +
                '<a href="{{model.url}}" target="_blank" title="{{model.name}}" ><img src="{{model.thumbnailUrl}}"></a>' +
            '<div>' +
            '<div class="filename">' +
                '<span class="">{{model.name}}</span>' +
            '</div>' +
        '<div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImageListItemView", ImageListItemView);
