//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ImageListItemView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


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
