//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MeldModel')

//@Require('Class')
//@Require('Set')
//@Require('bugdelta.DeltaDocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('carapace.CarapaceCollection')
//@Require('carapace.CarapaceModel')
//@Require('meldbug.MeldDocument')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var DeltaDocumentChange     = bugpack.require('bugdelta.DeltaDocumentChange');
var ObjectChange            = bugpack.require('bugdelta.ObjectChange');
var SetChange               = bugpack.require('bugdelta.SetChange');
var CarapaceCollection      = bugpack.require('carapace.CarapaceCollection');
var CarapaceModel           = bugpack.require('carapace.CarapaceModel');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');


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
         * @type {MeldDocument}
         */
        this.meldDocument = null;

        // NOTE BRN: When we receive a MeldDocument, we should convert it into a basic object and store the MeldDocument.
        // Otherwise, we should just pass it through

        if (Class.doesExtend(object, MeldDocument)) {
            this.meldDocument = object;
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
        this.addListenersToMeldDocument();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldDocument} meldDocument
     */
    setMeldDocument: function(meldDocument) {
        this.meldDocument = meldDocument;

        //TODO BRN: Do we need to clear out past values?

        this.set(meldDocument.generateObject());
        this.addListenersToMeldDocument();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    addListenersToMeldDocument: function() {
        if (this.meldDocument) {
            this.meldDocument.addEventListener(MeldDocument.EventTypes.DESTROYED, this.handleDestroyed, this);
            this.meldDocument.addEventListener(MeldDocument.EventTypes.PROPERTY_CHANGES, this.handlePropertyChanges, this);
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
            switch (deltaChange.getChangeType()) {
                case DeltaDocumentChange.ChangeTypes.DATA_SET:
                    setAttributes = deltaChange.getData();
                    set = true;
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                    _this.unset(deltaChange.getPropertyName());
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_SET:
                    set = true;
                    setAttributes[deltaChange.getPropertyName()] = deltaChange.getPropertyValue();
                    break;
                case SetChange.ChangeTypes.ADDED_TO_SET:
                    var value =  deltaChange.getSetValue();
                    var path = deltaChange.getPath();
                    var currentValue = _this.get(path);
                    if (currentValue) {
                        if (Class.doesExtend(currentValue, CarapaceCollection)) {
                            currentValue.add(value);
                        } else {
                            if (Class.doesExtend(currentValue, Set)) {
                                currentValue.add(value);
                                //TODO BRN: How can we trigger a change notification in Backbone?
                            } else {
                                throw new Error("Unsupported type found in backbone model - currentValue:", currentValue);
                            }
                        }
                    } else {
                        setAttributes[path] = new Set([value]);
                        set = true;
                    }
                    break;
                case SetChange.ChangeTypes.REMOVED_FROM_SET:
                    var value =  deltaChange.getSetValue();
                    var path = deltaChange.getPath();
                    var currentValue = _this.get(path);
                    if (currentValue) {
                        if (Class.doesExtend(currentValue, CarapaceCollection)) {
                            currentValue.remove(value);
                        } else {
                            if (Class.doesExtend(currentValue, Set)) {
                                currentValue.remove(value);
                                //TODO BRN: How can we trigger a change notification in Backbone?
                            } else {
                                throw new Error("Unsupported type found in backbone model - currentValue:", currentValue);
                            }
                        }
                    }
                    break;
            }
        });
        if (set) {
            this.set(setAttributes);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MeldModel", MeldModel);
