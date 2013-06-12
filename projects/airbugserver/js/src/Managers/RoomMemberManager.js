//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

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

var RoomMemberInterface = {
    
};

// Implementation of Room interface for mongoose Model
var RoomMemberManager = Class.extend(Obj, {

    _constructor: function(model, schema){

        this._super();


        //-------------------------------------------------------------------------------
        // Dependencies
        //-------------------------------------------------------------------------------

        /**
         * @type {mongoose.Model}
         */
        this.model  = model;

        /**
         * @type {mongoose.Schema}
         */
        this.schema = schema;

        Proxy.proxy(this, this.model, [
            'find',
            'findById',
            'populate'
        ]);

        Proxy.proxy(this, this.schema, [
            'pre',
            'post',
            'virtual'
        ]);

    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    configure: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};


        this.pre('save', function (next){
            if (!this.createdAt) this.createdAt = new Date();
            next();
        });
        this.pre('save', function(next){
            this.updatedAt = new Date();
        });

        callback();
    },

    getModel: function(){
        return this.model;
    },

    getSchema: function(){
        return this.schema;
    },

    create: function(roomMember, callback){
        this.model.create(roomMember, callback);
    },

    findAndRemoveById: function(roomMemberId, callback){
        this.findById(roomMemberId, function(error, roomMember){
            if(!error){
                
            }
        })
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
