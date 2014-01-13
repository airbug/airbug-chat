//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ImagePreviewView')

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

var ImagePreviewView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:       '<div id="{{id}}" class="image-preview">\
                <a href="{{url}}" title="{{filename}}" ><img src="{{thumbnailUrl}}"></a>\
    <div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        data.id             = this.getId() || "image-preview-" + this.getCid();
        data.filename       = this.attributes.filename;
        data.url            = this.attributes.url;
        data.thumbnailUrl   = this.attributes.thumbnailUrl;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ImagePreviewView", ImagePreviewView);
