//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TrackerModule')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TrackerModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sonarbugClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient = sonarbugClient;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    //TODO
    /**
     *
     */
    deinitialize: function(){

    },

    /**
     *
     */
     initialize: function(callback){
        this.sonarbugClient.startTracking();
        this.trackDocumentEvents();
        if(callback && typeof callback === "function") callback(null);
     },

    /**
     * @param {string} eventName
     * @param {{*}} data
     */
    track: function(eventName, data){
        this.trackSB(eventName, data);
    },

    /**
     *
     */
    trackAppLoad: function() {
        this.track("appLoad", null);
    },

    /**
     *
     */
    trackDocumentEvents: function(){
        this.trackClicksOnDocument();
        this.trackMousedownsOnDocument();
        this.trackMouseupsOnDocument();
    },

    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    trackClicksOnDocument: function(){
        var _this = this;
        $(document).on("click", function(event){
            var data = _this.parseEventForTracking(event);
            _this.track("mouseclick", data);
        });
    },

    /**
     * @private
     */
    trackMousedownsOnDocument: function(){
        var _this = this;
        $(document).on("mousedown", function(event){
            var data = _this.parseEventForTracking(event);
            _this.track("mousedown", data);
        });
    },

    /**
     * @private
     */
    trackMouseupsOnDocument: function(){
        var _this = this;
        $(document).on("mouseup", function(event){
            var data = _this.parseEventForTracking(event);
            _this.track("mouseup", data);
        });
    },

    /**
     * @private
     * @param {Event} event
     */
    parseEventForTracking: function(event){
        var data    = {};
        var $target = $(event.target);

        data.trackingId         = $target.data("tracking-id");
        data.trackingClasses    = $target.data("tracking-classes");
        data.html               = $target.html();
        data.nodeName           = event.target.nodeName;

        return data;
    },

    /**
     * @private
     * @param {string} eventName
     * @param {{*}} data
     */
    trackSB: function(eventName, data){
        this.sonarbugClient.track(eventName, data);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.TrackerModule', TrackerModule);
