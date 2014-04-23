//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MappedMeldModel')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('carapace.CarapaceModel')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Map                     = bugpack.require('Map');
    var Obj                     = bugpack.require('Obj');
    var CarapaceModel           = bugpack.require('carapace.CarapaceModel');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceModel}
     */
    var MappedMeldModel = Class.extend(CarapaceModel, {

        _name: "airbug.MappedMeldModel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} dataObject
         * @param {Map.<string, MeldDocument>} meldDocumentMap
         */
        _constructor: function(dataObject, meldDocumentMap) {

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, MeldDocument>}
             */
            this.meldDocumentMap = new Map();

            this._super(dataObject);

            var _this = this;
            meldDocumentMap.forEach(function(meldDocument, key) {
                _this.putMeldDocument(key, meldDocument);
            });
        },


        //-------------------------------------------------------------------------------
        // BugModel Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clear: function() {
            var _this = this;
            this.meldDocumentMap.forEach(function(meldDocument, key) {
                _this.removeMeldDocument(key);
            });
            this.clearProperties();
        },

        /**
         * @protected
         */
        createModel: function() {
            this._super();
            this.processMeldDocuments();
        },

        /**
         * @protected
         */
        destroyModel: function() {
            this._super();
            this.unprocessMeldDocuments();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} key
         * @returns {MeldDocument}
         */
        getMeldDocument: function(key) {
            return this.meldDocumentMap.get(key);
        },

        /**
         * @protected
         * @param {string} key
         * @param {MeldDocument} meldDocument
         */
        processMeldDocument: function(key, meldDocument) {

        },

        /**
         * @protected
         */
        processMeldDocuments: function() {
            var _this = this;
            this.meldDocumentMap.forEach(function(meldDocument, key) {
                _this.processMeldDocument(key, meldDocument);
            });
        },

        /**
         * @protected
         * @param {string} key
         * @param {MeldDocument} meldDocument
         */
        unprocessMeldDocument: function(key, meldDocument) {

        },

        /**
         * @protected
         */
        unprocessMeldDocuments: function() {
            var _this = this;
            this.meldDocumentMap.forEach(function(meldDocument, key) {
                _this.unprocessMeldDocument(key, meldDocument);
            });
        },

        /**
         * @protected
         * @param {string} key
         * @param {MeldDocument} meldDocument
         */
        putMeldDocument: function(key, meldDocument) {
            if (this.meldDocumentMap.containsKey(key)) {
                this.removeMeldDocument(key);
            }
            this.meldDocumentMap.put(key, meldDocument);
            if (this.isCreated()) {
                this.processMeldDocument(key, meldDocument);
                this.reinitialize();
            }
        },

        /**
         * @protected
         * @param {string} key
         */
        removeMeldDocument: function(key) {
            if (this.meldDocumentMap.containsKey(key)) {
                var meldDocument = this.meldDocumentMap.remove(key);
                if (this.isCreated()) {
                    this.unprocessMeldDocument(key, meldDocument);
                    this.reinitialize();
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MappedMeldModel", MappedMeldModel);
});
