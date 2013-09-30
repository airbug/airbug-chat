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

    _constructor: function(object, options) {

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldObject}
         */
        this.meldObject = null;

        // NOTE BRN: When we receive a MeldObject, we should convert it into a basic object and store the MeldObject.
        // Otherwise, we should just pass it through

        if (Class.doesExtend(object, MeldObject)) {
            this.meldObject = object;
            this._super(object.generateObject(), options);
        } else {
            this._super(object, options);
        }
    },


    //-------------------------------------------------------------------------------
    // CarapaceModel Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param attributes
     * @param options
     */
    initialize: function(attributes, options) {
        this._super(attributes, options);
        this.addListenersToMeldObject();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldObject} meldObject
     */
    setMeldObject: function(meldObject){
        this.meldObject = meldObject;

        //TODO BRN: Do we need to clear out past values?

        this.set(meldObject.generateObject());
        this.addListenersToMeldObject();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
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
        var delta = event.getData().delta;
        var setAttributes = {};
        var set = false;
        delta.getChangeList().forEach(function(deltaChange) {
            switch(deltaChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    var propertyName = deltaChange.getPropertyName();
                    var propertyValue = deltaChange.getPropertyValue();
                    _this.unset(propertyName);
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    var propertyName = deltaChange.getPropertyName();
                    var propertyValue = deltaChange.getPropertyValue();
                    set = true;
                    setAttributes[propertyName] = propertyValue;
                    break;
                case SetChange.ChangeTypes.ADD_TO_SET:
                    var value =  deltaChange.getValue();
                    var path = deltaChange.getPath();
                    var currentValue = _this.get(path);
                    if (currentValue) {
                        if (Class.doesExtend(currentValue, CarapaceCollection)) {
                            currentValue.add(value);
                        } else {

                            //Assume array

                            currentValue.push(value);
                            setAttributes[path] = currentValue;
                        }
                    } else {
                        setAttributes[path] = [value];
                    }
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
