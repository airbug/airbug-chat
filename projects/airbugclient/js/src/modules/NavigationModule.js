//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.NavigationModule')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Url')
//@Require('TypeUtil')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var Url                             = bugpack.require('Url');
var TypeUtil                        = bugpack.require('TypeUtil');
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

var NavigationModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(carapaceRouter, window) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
    },

    /**
     * @return {string}
     */
    getFinalDestination: function() {
        return this.finalDestination;
    },

    /**
     */
    clearFinalDestination: function() {
        this.finalDestination = null;
    },

    /**
     * @param {string} finalDestination
     */
    setFinalDestination: function(finalDestination) {
        this.finalDestination = finalDestination;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(NavigationModule).with(
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
