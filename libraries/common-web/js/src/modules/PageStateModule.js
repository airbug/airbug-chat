//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.PageStateModule')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
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

    var Class                           = bugpack.require('Class');
    var Map                             = bugpack.require('Map');
    var Obj                             = bugpack.require('Obj');
    var ArgTag                   = bugpack.require('bugioc.ArgTag');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PageStateModule = Class.extend(Obj, {

        _name: "airbug.PageStateModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {CarapaceRouter} carapaceRouter
         */
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
        // Public Methods
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
        // Private Methods
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

    bugmeta.tag(PageStateModule).with(
        module("pageStateModule")
            .args([
                arg().ref("carapaceRouter")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PageStateModule", PageStateModule);
});
