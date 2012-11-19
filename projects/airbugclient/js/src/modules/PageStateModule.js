//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PageStateModule')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageStateModule = Class.extend(Obj, {

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
