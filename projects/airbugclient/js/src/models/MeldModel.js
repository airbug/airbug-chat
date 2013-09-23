//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MeldModel')

//@Require('Class')
//@Require('bugdelta.PropertyChange')
//@Require('carapace.CarapaceModel')
//@Require('meldbug.MeldObject')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var PropertyChange  = bugpack.require('bugdelta.PropertyChange');
var CarapaceModel   = bugpack.require('carapace.CarapaceModel');
var MeldObject      = bugpack.require('meldbug.MeldObject');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldModel = Class.extend(CarapaceModel, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(object, id) {

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldObject}
         */
        this.meldObject = null;

        if(Class.doesExtend(object, MeldObject){
            this.meldObject = object;
            this._super(object.generateObject(), object.getMeldId());
        } else {
            this._super(object, id);
        }

    },


    //-------------------------------------------------------------------------------
    // CarapaceModel Implementation
    //-------------------------------------------------------------------------------

    initialize: function(attributes, options) {
        this._super(attributes, options);

        this.addListenersToMeldObject();
    },

    setMeldObject: function(meldObject){
        this.meldObject = meldObject;
        this.addListenersToMeldObject();
    },

    addListenersToMeldObject: function(){
        if(this.meldObject){
            this.meldObject.addEventListener(MeldObject.EventTypes.DESTROYED, this.handleDestroyed, this);
            this.meldObject.addEventListener(MeldObject.EventTypes.PROPERTY_CHANGES, this.handlePropertyChanges, this);
        }
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    handleDestroyed: function(event) {
        //TODO BRN: Need to clean up this model and remove it from anything collection it may be part of...
    },

    /**
     * @private
     * @param {Event} event
     */
    handlePropertyChanges: function(event) {
        var _this = this;
        var changeMap = event.getData().changeMap;
        var setAttributes = {};
        var set = false;
        changeMap.forEach(function(propertyChange) {
            var propertyName = propertyChange.getPropertyName();
            var propertyValue = propertyChange.getPropertyValue();
            switch(propertyChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    _this.unset(propertyName);
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    set = true;
                    setAttributes[propertyName] = propertyValue;
                    break;
            }
        });
        this.set(setAttributes);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MeldModel", MeldModel);
