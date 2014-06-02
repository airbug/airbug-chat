//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.InteractionStatusModule')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('airbug.InteractionStatusDefines')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Map                             = bugpack.require('Map');
    var Obj                             = bugpack.require('Obj');
    var InteractionStatusDefines        = bugpack.require('airbug.InteractionStatusDefines');
    var BugFlow                         = bugpack.require('bugflow.BugFlow');
    var ArgTag                   = bugpack.require('bugioc.ArgTag');
    var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var JQuery                          = bugpack.require('jquery.JQuery');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;
    var $series                         = BugFlow.$series;
    var $task                           = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var InteractionStatusModule = Class.extend(Obj, {

        _name: "airbug.InteractionStatusModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Window} window
         * @param {InteractionStatusDelegate} interactionStatusDelegate
         */
        _constructor: function(window, interactionStatusDelegate) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {number}
             */
            this.idleDelay                  = 1000 * 60 * 5;

            /**
             * @private
             * @type {InteractionStatusDefines.Status}
             */
            this.interactionStatus          = InteractionStatusDefines.Status.IDLE;

            /**
             * @private
             * @type {InteractionStatusDelegate}
             */
            this.interactionStatusDelegate  = interactionStatusDelegate;

            /**
             * @private
             * @type {number}
             */
            this.interactionTimeoutId       = null;

            /**
             * @private
             * @type {Window}
             */
            this.window                     = window;

            var _this = this;
            this.hearInteraction = function() {
                _this.handleInteraction();
            };
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getIdleDelay: function() {
            return this.idleDelay;
        },

        /**
         * @param {number} idleDelay
         */
        setIdleDelay: function(idleDelay) {
            this.idleDelay = idleDelay;
        },

        /**
         * @return {InteractionStatusDefines.Status}
         */
        getInteractionStatus: function() {
            return this.interactionStatus;
        },

        /**
         * @return {Window}
         */
        getWindow: function() {
            return this.window;
        },


        //-------------------------------------------------------------------------------
        // IInitializeModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            JQuery(this.window).off("mousedown keydown mousemove touchstart touchmove", this.hearInteraction);
            this.clearInteractionTimeout();
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            JQuery(this.window).on("mousedown keydown mousemove touchstart touchmove", this.hearInteraction);
            this.startInteractionTimeout();
            callback();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        clearInteractionTimeout: function() {
            if (this.interactionTimeoutId) {
                clearTimeout(this.interactionTimeoutId);
                this.interactionTimeoutId = null;
            }
        },

        /**
         * @private
         */
        handleInteraction: function() {
            this.startInteractionTimeout();
            if (this.interactionStatus !== InteractionStatusDefines.Status.ACTIVE) {
                this.setInteractionStatus(InteractionStatusDefines.Status.ACTIVE);
            }
        },

        /**
         * @param {InteractionStatusDefines.Status} interactionStatus
         */
        setInteractionStatus: function(interactionStatus) {
            this.interactionStatusDelegate.setInteractionStatus(interactionStatus);
        },

        /**
         * @private
         */
        startInteractionTimeout: function() {
            var _this = this;
            this.clearInteractionTimeout();
            this.interactionTimeoutId = setTimeout(function() {
                _this.interactionTimeoutId = null;
                _this.setInteractionStatus(InteractionStatusDefines.Status.IDLE);
            }, this.idleDelay);
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(InteractionStatusModule, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(InteractionStatusModule).with(
        module("interactionStatusModule")
            .args([
                arg().ref("window"),
                arg().ref("interactionStatusDelegate")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.InteractionStatusModule", InteractionStatusModule);
});
