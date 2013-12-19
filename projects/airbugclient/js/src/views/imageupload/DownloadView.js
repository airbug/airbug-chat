//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('DownloadView')

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

var UploadView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:       '<tr class="template-download fade">\
            <td>\
                <span class="preview">\
                <a href="{{fileUrl}}" title="{{fileName}}" download="{{fileName}}" data-gallery><img src="{{thumbnailUrl}}"></a>\
                </span>\
            </td>\
            <td>\
                <p class="name">\
                <a href="{{fileUrl}}" title="{{fileName}}" download="{{fileName}}">{{fileName}}</a>\
                </p>\
                <div><span class="error">Error</span> {{fileError}}</div>\
            </td>\
            <td>\
                <span class="size">{{fileSize}}</span>\
            </td>\
            <td>\
                <button class="delete" data-type="{{deleteType}}" data-url="{{deleteUrl}}"</button>\
                <input type="checkbox" name="delete" value="1" class="toggle">\
            </td>\
        </tr>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "download-" + this.getCid();
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DownloadView", DownloadView);
