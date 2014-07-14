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

//@Export('airbug.NavigationModule')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('Url')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');
    var Url         = bugpack.require('Url');
    var ArgTag      = bugpack.require('bugioc.ArgTag');
    var ModuleTag   = bugpack.require('bugioc.ModuleTag');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg         = ArgTag.arg;
    var bugmeta     = BugMeta.context();
    var module      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var NavigationModule = Class.extend(Obj, {

        _name: "airbug.NavigationModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CarapaceRouter} carapaceRouter
         * @param {Window} window
         */
        _constructor: function(carapaceRouter, window) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CarapaceRouter}
             */
            this.carapaceRouter         = carapaceRouter;

            /**
             * @private
             * @type {string}
             */
            this.finalDestination       = null;

            /**
             * @private
             * @type {Map<number, string>}
             */
            this.goBackIdToFragmentMap  = new Map();

            /**
             * @private
             * @type {number}
             */
            this.lastGoBackId           = 0;

            /**
             * @private
             * @type {Window}
             */
            this.window                 = window;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getFinalDestination: function() {
            return this.finalDestination;
        },

        /**
         * @param {string} finalDestination
         */
        setFinalDestination: function(finalDestination) {
            this.finalDestination = finalDestination;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clearFinalDestination: function() {
            this.finalDestination = null;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} goBackId
         * @param {Object} options
         */
        goBack: function(goBackId, options) {
            var goBackFragment = this.goBackIdToFragmentMap.get(goBackId);
            if (TypeUtil.isString(goBackFragment)) {
                this.goBackIdToFragmentMap.remove(goBackId);
                this.navigate(goBackFragment, options);
            }
        },

        /**
         * @return {number}
         */
        markPreviousGoBack: function() {
            var previousFragment = this.carapaceRouter.getPreviousFragment();
            var goBackId = ++this.lastGoBackId;
            this.goBackIdToFragmentMap.put(goBackId, previousFragment);
            return goBackId;
        },

        /**
         * @param {string} fragment
         * @param {Object} options
         */
        navigate: function(fragment, options) {
            this.carapaceRouter.navigate(fragment, options);
        },

        /**
         * @param {(string | Url)} url
         */
        navigateToUrl: function(url) {
            var href = undefined;
            if (Class.doesExtend(url, Url)) {
                href = url.toString();
            } else if (TypeUtil.isString(url)) {
                href = url;
            } else {
                throw new Error("'url' must be a string or a Url instance");
            }
            this.window.location.href = href;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(NavigationModule).with(
        module("navigationModule")
            .args([
                arg("carapaceRouter").ref("carapaceRouter"),
                arg("window").ref("window")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.NavigationModule", NavigationModule);
});
