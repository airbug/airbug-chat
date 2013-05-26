//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var BugFlow     = bugpack.require('bugflow.BugFlow');
var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var Proxy       = bugpack.require('Proxy');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series     = BugFlow.$series;
var $task       = BugFlow.$task;

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomInterface = {
    
};

// Implementation of Room interface for mongoose Model
var RoomManager = Class.extend(Obj, {

    _constructor: function(model, schema, roomMemberManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Dependencies
        //-------------------------------------------------------------------------------

        /**
         * @type {mongoose.Model.Room}
         */
        this.model  = model;

        this.schema = schema;

        this.roomMemberManager = roomMemberManager;

        Proxy.proxy(this, this.model, [
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
        if(!callback || typeof callback !== 'function'){
            callback = function(){};
        }

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
                _this.RoomMemberManager.create({userId: userId}, function(){

                });
                room.membersList.push(roomMember);
                room.save(callback);
            } else {
                callback(error);
            }
        })
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error)} callback
     */
    removeUser: function(roomId, userId, callback){
        var _this = this;
        var room;
        var roomMemberId;
        $series([
            $parallel([
                $task(function(flow){
                    _this.model.findById(roomId, function(error, returnedRoom){
                        if(!error) room = returnedRoom;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this.roomMemberManager.find({roomId: roomId, userId: userId}, function(error, roomMember){
                        if(!error) roomMemberId = roomMember.id;
                        flow.complete(error);
                    });
                })
            ]),
            $task(function(flow){
                room.membersList.remove(roomMemberId);
                room.save(function(error, room){
                    flow.complete(error);
                });
            })
            // $task(function(flow){
            //     var opts = {path: 'roomMember', model: 'RoomMember' , select: "userId"};
                // _this.roomMemberManager.populate(room, opts, function(error, returnedRoom){
                //     if(!error) room = returnedRoom;
                //     flow.complete(error);
                // });
            // }),
            // %task(function(flow){
            //     room.membersList.remove({userId, userId});
            //     room.save(function(error, room){
            //         flow.complete(error);
            //     })
            // })
        ]).execute(callback);
        // this.model.findById(roomId, function(error, room){
        //     if(!error){
        //         var opts = {path: 'roomMember', model: 'RoomMember' , select: "userId"};
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
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
