//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.TrackerModule')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.CommandModule')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var TypeUtil                        = bugpack.require('TypeUtil');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TrackerModule = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sonarbugClient, commandModule, trackingEnabled) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule      = commandModule;

        /**
         * @private
         * @type {SonarbugClient}
         */
        this.sonarbugClient     = sonarbugClient;

        /**
         * @private
         * @type {boolean}
         */
        this.trackingEnabled    = TypeUtil.isBoolean(trackingEnabled) ? trackingEnabled : true;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getTrackingEnabled: function() {
        return this.trackingEnabled;
    },

    /**
     * @param {boolean} trackingEnabled
     */
    setTrackingEnabled: function(trackingEnabled) {
        this.trackingEnabled = trackingEnabled;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    //TODO
    /**
     *
     */
    deinitialize: function() {

    },

    /**
     *
     */
    initialize: function(callback) {
        if (this.trackingEnabled) {
            this.sonarbugClient.startTracking();
            this.trackDocumentEvents();
            this.initializeMessageSubscriptions();
            if (callback && typeof callback === "function") {
                callback(null);
            }
        } else {
            if (callback && typeof callback === "function") {
                callback(null);
            }
        }
    },

    /**
     * @param {string} eventName
     * @param {{*}} data
     */
    track: function(eventName, data) {
        if (this.trackingEnabled) {
            this.trackSB(eventName, data);
        }
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
    trackDocumentEvents: function() {
        this.trackClicksOnDocument();
        this.trackMousedownsOnDocument();
        this.trackMouseupsOnDocument();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    initializeMessageSubscriptions: function() {
        this.commandModule.subscribe(CommandModule.MessageType.BUTTON_CLICKED, this.handleButtonClickedMessage, this);
    },

    /**
     * @param {PublisherMessage} message
     */
    handleButtonClickedMessage: function(message) {
        var topic   = message.getTopic();
        /** @type {buttonName: string} */
        var data    = message.getData();
        this.track("buttonclick", data);
    },

    /**
     * @private
     * @param {Event} event
     */
    parseEventForTracking: function(event) {
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
    trackClicksOnDocument: function() {
        var _this = this;
        $(document).on("click", function(event) {
            var data = _this.parseEventForTracking(event);
            _this.track("mouseclick", data);
        });
    },

    /**
     * @private
     */
    trackMousedownsOnDocument: function() {
        var _this = this;
        $(document).on("mousedown", function(event) {
            var data = _this.parseEventForTracking(event);
            _this.track("mousedown", data);
        });
    },

    /**
     * @private
     */
    trackMouseupsOnDocument: function() {
        var _this = this;
        $(document).on("mouseup", function(event) {
            var data = _this.parseEventForTracking(event);
            _this.track("mouseup", data);
        });
    },

    /**
     * @private
     * @param {string} eventName
     * @param {{*}} data
     */
    trackSB: function(eventName, data) {
        this.sonarbugClient.track(eventName, data);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(TrackerModule).with(
    module("trackerModule")
        .args([
            arg().ref("sonarbugClient"),
            arg().ref("commandModule")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbug.TrackerModule', TrackerModule);
