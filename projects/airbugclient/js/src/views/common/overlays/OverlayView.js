//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('OverlayView')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
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

var OverlayView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="{{id}}" class="{{overlayWrapperClasses}}">' +
            '<div class="overlay-background">' +
            '</div>' +
            '<div class="{{overlayClasses}}">' +
            '</div>' +
        '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.findElement('.overlay-background').off();
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.findElement('.overlay-background').on('click', function(event) {
            _this.handleBackgroundClick(event);
        });
    },

    //-------------------------------------------------------------------------------
    // MustacheView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "overlay-" + this.getCid();

        if(this.attributes.classes){
            data.overlayWrapperClasses = this.attributes.classes + " overlay";
        } else {
            data.overlayWrapperClasses = "overlay";
        }
        data.overlayClasses = "overlay-body";
        switch (this.attributes.type) {
            case OverlayView.Type.APPLICATION:
                data.overlayWrapperClasses += " application-overlay";
                break;
            case OverlayView.Type.PAGE:
                data.overlayWrapperClasses += " page-overlay";
                break;
            case OverlayView.Type.PANEL:
                data.overlayWrapperClasses += " panel-overlay";
                break;
        }
        switch (this.attributes.size) {
            case OverlayView.Size.ONE_HALF:
                data.overlayClasses += " one-half-overlay";
                break;
            case OverlayView.Size.ONE_THIRD:
                data.overlayClasses += " one-third-overlay";
                break;
            case OverlayView.Size.FULLSCREEN:
                data.overlayClasses += " fullscreen-overlay";
                break;
        }
        return data;
    },

    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {jQuery.Event} event
     */
    handleBackgroundClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ButtonViewEvent(ButtonViewEvent.EventType.CLICKED));
    }
});

OverlayView.Type = {
    APPLICATION: "application-overlay",
    PAGE: "page-overlay",
    PANEL: "panel-overlay"
};

OverlayView.Size = {
    ONE_QUARTER: "one-quarter-overlay",
    ONE_THIRD:   "one-third-overlay",
    ONE_HALF:    "one-half-overlay",
    FULLSCREEN:  "fullscreen-overlay"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.OverlayView", OverlayView);
