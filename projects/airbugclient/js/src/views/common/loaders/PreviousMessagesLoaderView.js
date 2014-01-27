//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PreviousMessagesLoaderView')

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

var PreviousMessagesLoaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="{{id}}" class="previous-messages-loader">' +
            '<img src="{{{staticUrl}}}/img/loader-line-large.gif">' +
            '</img>' +
            '<p>retrieving previous messages...</p>'+
        '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        data.id             = this.getId() || "previous-messages-loader-" + this.getCid();
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PreviousMessagesLoaderView", PreviousMessagesLoaderView);
