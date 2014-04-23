//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.DialogueService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@require('Pair')
//@Require('Set')
//@Require('airbugserver.EntityService')
//@Require('airbugserver.User')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var Pair                    = bugpack.require('Pair')
var Set                     = bugpack.require('Set');
var EntityService           = bugpack.require('airbugserver.EntityService');
var User                    = bugpack.require('airbugserver.User');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DialogueService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(logger, dialogueManager, dialoguePusher, userManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {DialogueManager}
         */
        this.dialogueManager                = dialogueManager;

        /**
         * @private
         * @type {DialoguePusher}
         */
        this.dialoguePusher                 = dialoguePusher;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager                    = userManager;
    },


    //-------------------------------------------------------------------------------
    // Service Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      userIdPair: (Pair | {a: *, b: *})
     * }} dialogueData
     * @param {function(Throwable, Dialogue=)} callback
     */
    createDialogue: function(requestContext, dialogueData, callback) {
        var _this           = this;
        var dialogue        = this.dialogueManager.generateDialogue(dialogueData);
        var currentUser     = requestContext.get('currentUser');
        var call            = requestContext.get("call");
        var otherUserId     = dialogue.getUserIdPair().getOther(currentUser.getId());

        if (currentUser.isNotAnonymous()) {
            if (dialogue.getUserIdPair().contains(currentUser.getId())) {
                $series([
                    $task(function(flow) {
                        _this.userManager.retrieveUser(otherUserId, function(throwable, otherUser) {
                            if (!throwable) {
                                if (otherUser) {
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("NotFound", {}, "User with id '" + otherUserId + "' does not exist"));
                                }
                            } else {
                                flow.error(throwable);
                            }
                        });
                    }),
                    $task(function(flow) {

                        //NOTE BRN: Ensure that a dialogue with this userIdPair does not already exist

                        _this.dialogueManager.retrieveDialogueByUserIdPair(dialogue.getUserIdPair(), function(throwable, dialogue) {
                            if (!throwable) {
                                if (!dialogue) {
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("AlreadyExists", {}, "A Dialogue with this userIdPair already exists"));
                                }
                            } else {
                                flow.error(throwable);
                            }
                        });
                    }),
                    $task(function(flow) {
                        _this.dialogueManager.createDialogue(dialogue, ['conversation'], function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.dialoguePusher.meldCallWithDialogue(call.getCallUuid(), dialogue, function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.dialoguePusher.pushDialogue(dialogue, [call.getCallUuid()], function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, dialogue);
                    } else {
                        callback(throwable);
                    }
                });
            } else {
                callback(new Exception('UnauthorizedAccess', {}, "CurrentUser is not part of the Dialogue"));
            }
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "CurrentUser is anonymous"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} dialogueId
     * @param {function(Throwable, Dialogue=)} callback
     */
    deleteDialogue: function(requestContext, dialogueId, callback) {
        //TODO BRN: Implement
        callback(new Exception('UnauthorizedAccess', {}, "Not implemented"));
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} dialogueId
     * @param {function(Throwable, Dialogue=)} callback
     */
    retrieveDialogue: function(requestContext, dialogueId, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {Dialogue} */
        var dialogue            = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dialogueManager.retrieveDialogue(dialogueId, function(throwable, returnedDialogue) {
                        if (!throwable) {
                            if (returnedDialogue) {
                                if (returnedDialogue.getUserIdPair().contains(currentUser.getId())) {
                                    dialogue = returnedDialogue;
                                    flow.complete(throwable);
                                } else {
                                    flow.error(new Exception('UnauthorizedAccess', {}, "CurrentUser does not have access to Dialogue"));
                                }
                            } else {
                                flow.error(new Exception('NotFound', {}, "Could not find dialogue with the id '" + dialogueId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.meldCallWithDialogue(call.getCallUuid(), dialogue, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.pushDialogueToCall(dialogue, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, dialogue);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users cannot access Dialogues"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, Dialogue=)} callback
     */
    retrieveDialogueByUserIdForCurrentUser: function(requestContext, userId, callback) {
        var _this           = this;
        var call            = requestContext.get("call");
        var currentUser     = requestContext.get('currentUser');

        /** @type {Dialogue} */
        var dialogue        = null;
        var userIdPair      = new Pair(userId, currentUser.getId());
        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dialogueManager.retrieveDialogueByUserIdPair(userIdPair, function(throwable, returnedDialogue) {
                        if (!throwable) {
                            if (returnedDialogue) {
                                dialogue = returnedDialogue;
                                flow.complete(throwable);
                            } else {
                                flow.error(new Exception('NotFound', {}, "Could not find dialogue with the userIdPair '" + userIdPair + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.meldCallWithDialogue(call.getCallUuid(), dialogue, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.pushDialogueToCall(dialogue, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, dialogue);
                } else {
                    callback(throwable);
                }
            });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users cannot access Dialogues"));
        }
    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} dialogueIds
     * @param {function(Throwable, Map.<string, Dialogue>=)} callback
     */
    retrieveDialogues: function(requestContext, dialogueIds, callback) {
        var _this               = this;
        /** @type {Map.<string, Dialogue>} */
        var dialogueMap         = null;
        var currentUser         = requestContext.get('currentUser');
        var call                = requestContext.get("call");
        var dialogueManager     = this.dialogueManager;
        var mappedException     = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    dialogueManager.retrieveDialogues(dialogueIds, function(throwable, returnedDialogueMap) {
                        if (!throwable) {
                            dialogueMap = returnedDialogueMap.clone();
                            returnedDialogueMap.forEach(function(dialogue, key) {
                                if (dialogue === null) {
                                    dialogueMap.remove(key);
                                    if (!mappedException) {
                                        mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                    }
                                    mappedException.putCause(key, new Exception("NotFound", {objectId: key}, "Could not find Dialogue with the id '" + key + "'"));
                                } else if (!dialogue.getUserIdPair().contains(currentUser.getId())) {
                                    dialogueMap.remove(key);
                                    if (!mappedException) {
                                        mappedException = new MappedThrowable(MappedThrowable.MAPPED);
                                    }
                                    mappedException.putCause(key, new Exception('UnauthorizedAccess', {objectId: key}, "CurrentUser does not have access to Dialogue with the id '" + key + "'"));
                                }
                            });
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.meldCallWithDialogues(call.getCallUuid(), dialogueMap.getValueArray(), function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dialoguePusher.pushDialoguesToCall(dialogueMap.getValueArray(), call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(mappedException, dialogueMap);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception('UnauthorizedAccess', {}, "Anonymous users cannot retrieve Dialogues"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} dialogueId
     * @param {{*}} updates
     * @param {function(Throwable=)} callback
     */
    updateDialogue: function(requestContext, dialogueId, updates, callback) {
        //TODO BRN: Implement
        callback(new Exception('UnauthorizedAccess', {}, "Not implemented"));
    }


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(DialogueService).with(
    module("dialogueService")
        .args([
            arg().ref("logger"),
            arg().ref("dialogueManager"),
            arg().ref("dialoguePusher"),
            arg().ref("userManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.DialogueService', DialogueService);
