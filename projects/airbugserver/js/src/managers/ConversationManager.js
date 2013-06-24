//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationManager')

//@Require('Class')
//@Require('mongo.MongoManager')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var MongoManager  = bugpack.require('mongo.MongoManager');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManager = Class.extend(MongoManager, {

    _constructor: function(model, schema){

        this._super(model, schema);

    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     */
    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};


        this.pre('save', true, function(next, done){
            next();
            if (!this.createdAt) this.createdAt = new Date();
            done();
        });

        this.pre('save', true, function(next, done){
            next();
            this.updatedAt = new Date();
            done();
        });

        callback();
    },

    /**
     * @return {Conversation}
     */
    new: function(conversation){
        return new this.model(conversation);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationManager', ConversationManager);
