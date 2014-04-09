//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MeldModel')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('carapace.CarapaceModel')
//@Require('meldbug.MeldDocument')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug             = bugpack.require('ArgumentBug');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var CarapaceModel           = bugpack.require('carapace.CarapaceModel');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {CarapaceModel}
 */
var MeldModel = Class.extend(CarapaceModel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Object} dataObject
     * @param {MeldDocument} meldDocument
     */
    _constructor: function(dataObject, meldDocument) {

        this._super(dataObject);

        //TODO BRN: Add support for pass through properties from meld to model

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldDocument}
         */
        this.meldDocument   = undefined;

        this.setMeldDocument(meldDocument);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getMeldDocument: function() {
        return this.meldDocument;
    },

    /**
     *
     */
    removeMeldDocument: function() {
        if (this.meldDocument) {
            this.deinitialize();
            this.meldDocument = undefined;
            this.unprocessMeldDocument();
        }
    },

    /**
     * @param {MeldDocument} meldDocument
     */
    setMeldDocument: function(meldDocument) {
        if (!Obj.equals(this.meldDocument, meldDocument)) {
            this.removeMeldDocument();
            if (Class.doesExtend(meldDocument, MeldDocument)) {
                this.meldDocument = meldDocument;
                this.processMeldDocument();
                this.reinitialize();
            } else if (!TypeUtil.isUndefined(meldDocument) && !TypeUtil.isNull(meldDocument)) {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "meldDocument", meldDocument, "parameter must either be undefined or a MeldDocument");
            }
        }
    },


    //-------------------------------------------------------------------------------
    // BugModel Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     */
    clear: function() {
        this.removeMeldDocument();
        this.clearProperties();
        this.reinitialize();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    processMeldDocument: function() {

    },

    /**
     * @protected
     */
    unprocessMeldDocument: function() {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MeldModel", MeldModel);
