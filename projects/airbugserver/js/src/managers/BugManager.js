//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BugManager')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Proxy   = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {mongoose.Model}
         */
        this.model      = model;

        /**
         * @private
         * @type {mongoose.Schema}
         */
        this.schema     = schema;


        Proxy.proxy(this, this.model, [
            '$where',
            'aggregate',
            'count',
            'create',
            'distinct',
            'ensureIndexes',
            'find',
            'findById',
            'findByIdAndRemove',
            'findByIdAndUpdate',
            'findOne',
            'findOneAndRemove',
            'findOneAndUpdate',
            'mapReduce',
            'populate',
            'remove',
            'update',
            'where'
        ]);

        Proxy.proxy(this, this.schema, [
            'pre',
            'post',
            'virtual'
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {mongoose.Model}
     */
    getModel: function() {
        return this.model;
    },

    /**
     * @return {mongoose.Schema}
     */
    getSchema: function() {
        return this.schema;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    configure: function(callback) {
        callback()
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BugManager', BugManager);
