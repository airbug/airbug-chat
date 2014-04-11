//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.PageStateModule')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
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

var PageStateModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(carapaceRouter) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceRouter}
         */
        this.carapaceRouter             = carapaceRouter;

        /**
         * @private
         * @type {Map<string, *>}
         */
        this.stateKeyToPageStateDataMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @return {*}
     */
    getState: function(key) {
        var stateKey = this.generateStateKey(key);
        return this.stateKeyToPageStateDataMap.get(stateKey);
    },

    /**
     * @param {string} key
     * @param {*} data
     */
    putState: function(key, data) {
        var stateKey = this.generateStateKey(key);
        this.stateKeyToPageStateDataMap.put(stateKey, data);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} key
     * @return {string}
     */
    generateStateKey: function(key) {
        var currentFragment = this.carapaceRouter.getCurrentFragment();
        var stateKey = currentFragment + "_" + key;
        return stateKey;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PageStateModule).with(
    module("pageStateModule")
        .args([
            arg().ref("carapaceRouter")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PageStateModule", PageStateModule);
