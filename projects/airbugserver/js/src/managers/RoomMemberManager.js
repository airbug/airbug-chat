//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMemberManager')

//@Require('Class')
//@Require('mongo.MongoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MongoManager    = bugpack.require('mongo.MongoManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManager = Class.extend(MongoManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema) {

        this._super(model, schema);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------


    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {function(error)} callback
     */
    configure: function(callback) {
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
     * @param {Object} roomMember
     * @param {function(Error, RoomMember} callback
     */
    createRoomMember: function(roomMember, callback) {
        this.create(roomMember, function(error, roomMember) {
            if (callback) {
                callback(error, roomMember);
            }
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMemberManager', RoomMemberManager);
