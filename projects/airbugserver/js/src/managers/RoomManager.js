//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomManager')

//@Require('Class')
//@Require('mongo.MongoManager')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var MongoManager  = bugpack.require('mongo.MongoManager');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series     = BugFlow.$series;
var $task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomManager = Class.extend(MongoManager, {

    _constructor: function(model, schema, conversationManager, roomMemberManager){

        this._super(model, schema);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @type {airbugserver.ConversationManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @type {airbugserver.RoomMemberManager}
         */
        this.roomMemberManager      = roomMemberManager;

    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     */
    configure: function(callback){
        if (!callback || typeof callback !== 'function') var callback = function(){};
        var _this = this;

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

        this.post('save', function(next){
            if (!this.conversationId) {
                var conversation        = _this.conversationManager.new();
                var conversationId      = conversation.id;
                conversation.ownerId    = this.id;
                conversation.save(function(error, conversation){
                    if (!error && conversation){
                        next();
                    } else {
                        next(error);
                    }
                })
            }
        })

        callback();
    },

    /**
     * @param {} roomId
     * @param {function(error, membersList)} callback
     */
    getMembersList: function(roomId, callback){
        this.findById(roomId, function(error, room){
            callback(error, room.membersList);
        });
    },

    /**
     * @param {} roomId
     * @param {function(error, members)} callback
     */
    getMembers: function(roomId, callback){
        var _this = this;
        this.findById(roomId).populate("membersList").exec(function(error, room){
            callback(error, room.membersList);
        });   
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error, room)} callback
     */
    addUser: function(roomId, userId, callback){
        var _this = this;
        this.findById(roomId, function(error, room){
            if(!error && room){
                _this.roomMemberManager.create({userId: userId}, function(error, roomMember){
                    if(!error && roomMember){
                        room.membersList.push(roomMember); //What happens if I push the entire object instead of just the id???
                        room.save(callback);
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error, room);
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
        $series([
            $parallel([
                $task(function(flow){
                    _this.findById(roomId, function(error, returnedRoom){
                        if(!error && room) room = returnedRoom;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this.roomMemberManager.findById(roomMemberId, function(error, roomMember){
                        if(!error && roomMember) {
                            roomMember.remove(function(error){
                                flow.complete(error);
                            });
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
        ]).execute(function(error){
            callback(error, room);
        });
    },

    /**
     * @param {} roomId
     * @param {} userId
     * @param {function(error, room)} callback
     */
    removeUser: function(roomId, userId, callback){
        var _this = this;
        var room;
        $series([
            $parallel([
                $task(function(flow){
                    _this.findById(roomId, function(error, returnedRoom){
                        if(!error && room) room = returnedRoom;
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    _this.roomMemberManager.findOne({roomId: roomId, userId: userId}, function(error, roomMember){
                        if(!error && roomMember) {
                            roomMember.remove(function(error){
                                flow.complete(error);
                            });
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
        ]).execute(function(error){
            callback(error, room);
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomManager', RoomManager);
