//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageManager')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var Proxy       = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManager = Class.extend(Obj, {

    _constructor: function(model, schema){

        this._super();

        /**
         * @type {mongoose.Model}
         */
        this.model 	= model;

        /**
         * @type {mongoose.Schema}
         */
        this.schema = schema;

    },

    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};
        callback();
    },

    create: function(message, callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.model.create(message, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
