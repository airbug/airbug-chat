//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ButtonDropdownView')

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

var ButtonDropdownView = Class.extend(ButtonView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="button-wrapper {{buttonWrapperClasses}}">' +
                    '<div class="btn-group">' +
                        '<button id="button-{{cid}}" class="btn dropdown-toggle {{buttonClasses}}" data-toggle="dropdown">' +
                        '</button>' +
                        '<ul id="dropdown-list-{{cid}}" class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">' +
                        '</ul>' +
                    '</div>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ButtonDropdownView", ButtonDropdownView);
