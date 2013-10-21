//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('TrackerModule')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.CommandModule')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var CommandModule           = bugpack.require('airbug.CommandModule');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var property    = PropertyAnnotation.property;


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

        this.commandModule  = null;

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient = sonarbugClient;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
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
        this.initializeMessageSubscriptions();
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
    // Private Methods
    //-------------------------------------------------------------------------------

    initializeMessageSubscriptions: function(){
        this.commandModule.subscribe(CommandModule.MessageType.BUTTON_CLICKED, this.handleButtonClickedMessage, this);
    },

    /**
     * @param {PublisherMessage}
     */
    handleButtonClickedMessage: function(message){
        var topic   = message.getTopic();
        /** @type {buttonName: string} */
        var data    = message.getData();
        this.track("buttonclick", data);
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
     * @param {string} eventName
     * @param {{*}} data
     */
    trackSB: function(eventName, data){
        this.sonarbugClient.track(eventName, data);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(TrackerModule).with(
    autowired().properties([
        property("commandModule").ref("commandModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.TrackerModule', TrackerModule);
