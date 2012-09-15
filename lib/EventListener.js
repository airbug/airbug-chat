//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var Obj = require('./Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var EventListener = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(listenerFunction, listenerContext) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.listenerFunction = listenerFunction;

        this.listenerContext = listenerContext;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    equals: function(value) {
        if (Class.doesExtend(value, EventListener)) {
            return (value.listenerFunction === this.listenerFunction && value.listenerContext === this.listenerContext);
        }
        return false;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    hearEvent: function(event) {
        this.listenerFunction.call(this.listenerContext, event);
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = EventListener;
