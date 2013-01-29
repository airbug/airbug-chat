//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NavigationModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =     bugpack.require('Class');
var Map =       bugpack.require('Map');
var Obj =       bugpack.require('Obj');
var TypeUtil =  bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NavigationModule = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CarapaceRouter}
         */
        this.carapaceRouter = null;

        /**
         * @private
         * @type {Map<number, string>}
         */
        this.goBackIdToFragmentMap = new Map();

        /**
         * @private
         * @type {number}
         */
        this.lastGoBackId = 0;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NavigationModule", NavigationModule);
