//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

//@Require('Class')
//@Require('Proxy')
//@Require('airbugserver.BugManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Proxy       = bugpack.require('Proxy');
var BugManager  = bugpack.require('airbugserver.BugManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManager = Class.extend(BugManager, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema){

        this._super(model, schema);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
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
