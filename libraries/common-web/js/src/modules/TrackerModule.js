/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.TrackerModule')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('airbug.CommandModule')
//@Require('bugioc.ArgTag')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');
    var CommandModule   = bugpack.require('airbug.CommandModule');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var TrackerModule = Class.extend(Obj, {

        _name: "airbug.TrackerModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CommandModule} commandModule
         * @param {boolean} trackingEnabled
         */
        _constructor: function(commandModule, trackingEnabled) {

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

        /**
         *
         */
        deinitialize: function() {
            //TODO
        },

        /**
         *
         */
        initialize: function(callback) {
            if (this.trackingEnabled) {
                this.trackDocumentEvents();
                this.commandModule.subscribe(CommandModule.MessageType.BUTTON_CLICKED, this.handleButtonClickedMessage, this);
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
         * @param {*} data
         */
        track: function(eventName, data) {
            if (this.trackingEnabled) {
                //TODO BRN: Track through GA
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


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleButtonClickedMessage: function(message) {
            var topic   = message.getTopic();
            /** @type {{buttonName: string}} */
            var data    = message.getData();
            this.track("buttonclick", data);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(TrackerModule).with(
        module("trackerModule")
            .args([
                arg().ref("commandModule")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbug.TrackerModule', TrackerModule);
});
