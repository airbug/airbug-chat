//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NakedButtonDropdownView')

//@Require('Class')
//@Require('airbug.ButtonView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var ButtonView  = bugpack.require('airbug.ButtonView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NakedButtonDropdownView = Class.extend(ButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<div id="{{id}}-wrapper" class="btn-group">' +
        '<button id="{{id}}" class="btn dropdown-toggle {{buttonClasses}}" data-toggle="dropdown">' +
        '</button>' +
        '<ul id="dropdown-list-{{cid}}" class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
        '</ul>' +
        '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NakedButtonDropdownView", NakedButtonDropdownView);
