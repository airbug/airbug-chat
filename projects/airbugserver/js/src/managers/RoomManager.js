//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')

//@Require('Class')
//@Require('Proxy')
//@Require('airbugserver.BugManager')
//@Require('bugflow.BugFlow')


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
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomManager = Class.extend(BugManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema, roomMemberManager) {

        this._super(model, schema);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberManager}
         */
        this.roomMemberManager = roomMemberManager;
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

    getMembersList: function(roomId, callback){
        this.model.findById(roomId, function(error, room){
            return room.memberslist;
        });
    },

    getMembers: function(roomId, callback){
        // var _this = this;
        // this.model.findById(roomId, function(error, room){
        //     if(!error){
        //         var opts = {path: 'roomMember', model: 'RoomMember'};
        //         _this.roomMemberManager.populate(room, opts, function(error, room){
        //             if(!error){
        //                 room.membersList.remove({userId: userId}); // Test this
        //                 room.save(callback);
        //             } else {
        //                 callback(error);
        //             }
        //         });
        //     } else {
        //         callback(error);
        //     }
        // });    
    },

    /**
     * @param {} room
     * @param {function(error, room)} callback
     */
    create: function(room, callback){
        this.model.create(room, callback);
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error, room)} callback
     */
    addUser: function(roomId, userId, callback){
        var _this = this;
        this.model.findById(roomId, function(error, room){
            if(!error){
                _this.roomMemberManager.create({userId: userId}, function(error, roomMember){
                    if(!error && roomMember){
                        room.membersList.push(roomMember);
                        room.save(callback);
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error);
            }
        })
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error, room)} callback
     */
    removeRoomMember: function(roomId, roomMemberId, callback){
        var _this = this;
        var room;
        var roomMemberId;
        $series([
            $task(function(flow){
                _this.model.findById(roomId, function(error, returnedRoom){
                    if(!error) room = returnedRoom;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                room.membersList.remove(roomMemberId);
                room.save(function(error, room){
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error)} callback
     */
    removeUser: function(roomId, userId, callback){
        var _this = this;
        var room;
        var roomMember;
        var roomMemberId;
        $series([
            $parallel([
                $task(function(flow){
                    _this.model.findById(roomId, function(error, returnedRoom){
                        if(!error && room) room = returnedRoom;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this.roomMemberManager.find({roomId: roomId, userId: userId}, function(error, roomMember){
                        if(!error && roomMember) {
                            roomMember.remove(function(error, product){
                                flow.complete(error);
                            })
                        } else {
                            flow.complete(error);
                        }
                    });
                })
            ]),
            $parallel([
                $task(function(flow){
                    room.membersList.remove(roomMemberId);
                    room.save(function(error, room){
                        flow.complete(error);
                    });
                })
            ])
        ]).execute(callback);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
