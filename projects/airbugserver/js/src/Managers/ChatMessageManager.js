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
var Proxy		= bugpack.require('Proxy');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageManager = Class.extend(Obj, {

    _constructor: function(model, schema){

        this._super();

        this.model 	= model;

        this.schema = schema;

    },

    configure: function(callback){
        if(!callback || typeof callback !== 'function'){
            callback = function(){};
        }
        callback();
    },

    create: function(message, callback){
    	if(!callback || typeof callback !== 'function'){
            callback = function(){};
        }
        this.model.create(message, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageManager', ChatMessageManager);
