//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var User                    = bugpack.require('airbugserver.User');
var UserManager             = bugpack.require('airbugserver.UserManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------


bugyarn.registerWeaver("testAnonymousUser", function(yarn, args) {
    yarn.spin([
        "setupTestUserManager"
    ]);
    var userData = args[0] || {};
    var testUserData = Obj.merge(userData, {
        anonymous: true
    });
    return this.userManager.generateUser(testUserData);
});

bugyarn.registerWeaver("testNotAnonymousUser", function(yarn, args) {
    yarn.spin([
        "setupTestUserManager"
    ]);
    var userData = args[0] || {};
    var testUserData = Obj.merge(userData, {
        agreedToTermsDate: new Date(Date.now()),
        anonymous: false,
        email: "test@test.com",
        firstName: "testFirstName",
        lastName: "testLastName",
        passwordHash: "testPasswordHash",
        status: "active"
    });
    return this.userManager.generateUser(testUserData);
});

bugyarn.registerWinder("setupTestUserManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        userManager: new UserManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.userManager.setEntityType("User");
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var userManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        this.testUserManager   = new UserManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testUserManager, UserManager),
            "Assert instance of UserManager");
        test.assertEqual(this.testUserManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testUserManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testUserManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testUserManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};
bugmeta.tag(userManagerInstantiationTest).with(
    test().name("UserManager - instantiation test")
);

var userManagerCreateUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserManager"
        ]);
        this.schemaManager.configureModule();
        this.mongoDataStore.configureModule();

        this.testEmail              = makeEmail();
        this.testUser               = this.userManager.generateUser({
            email: this.testEmail
        });
        $series([
            $task(function(flow) {
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userManager.createUser(_this.testUser, function(throwable, user) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser, user,
                            "Assert user returned is the same user sent in");
                        var id = user.getId();
                        test.assertTrue(!!id,
                            "Assert create user has an id. id = " + id);
                        test.assertEqual(user.getEmail(), _this.testEmail,
                            "Assert user.getEmail returns the testEmail");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

var userManagerDeleteUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserManager"
        ]);
        this.schemaManager.configureModule();
        this.mongoDataStore.configureModule();

        this.testEmail              = makeEmail();
        this.testUser               = this.userManager.generateUser({
            email: this.testEmail
        });
        $series([
            $task(function(flow) {
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userManager.createUser(_this.testUser, function(throwable, user) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser, user,
                            "Assert user returned is the same user sent in");
                        var id = user.getId();
                        test.assertTrue(!!id,
                            "Assert create user has an id. id = " + id);
                        test.assertEqual(user.getEmail(), _this.testEmail,
                            "Assert user.getEmail returns the testEmail");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(_this.testUser.getId(), function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser.getId(), returnedUser.getId(),
                            "Assert user returned is the same user sent in");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.deleteUser(_this.testUser, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(_this.testUser.getId(), function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(returnedUser, null,
                            "Assert User no longer exists");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

var userManagerRetrieveUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserManager"
        ]);
        this.schemaManager.configureModule();
        this.mongoDataStore.configureModule();

        this.testEmail              = makeEmail();
        this.testUser               = this.userManager.generateUser({
            email: this.testEmail
        });
        $series([
            $task(function(flow) {
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userManager.createUser(_this.testUser, function(throwable, user) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser, user,
                            "Assert user returned is the same user sent in");
                        var id = user.getId();
                        test.assertTrue(!!id,
                            "Assert create user has an id. id = " + id);
                        test.assertEqual(user.getEmail(), _this.testEmail,
                            "Assert user.getEmail returns the testEmail");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(_this.testUser.getId(), function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser.getId(), returnedUser.getId(),
                            "Assert user returned is the same user sent in");
                    }
                    flow.complete(throwable);
                });
            }),
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

var userManagerUpdateUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this                   = this;
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserManager"
        ]);
        this.schemaManager.configureModule();
        this.mongoDataStore.configureModule();

        this.testEmail              = makeEmail();
        this.testEmailUpdate        = makeEmail();
        this.testUser               = this.userManager.generateUser({
            email: this.testEmail
        });
        $series([
            $task(function(flow) {
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userManager.createUser(_this.testUser, function(throwable, user) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(_this.testUser.getId(), function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser.getId(), returnedUser.getId(),
                            "Assert user returned is the same user sent in");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.testUser.setEmail(_this.testEmailUpdate);
                _this.userManager.updateUser(_this.testUser, function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser, returnedUser,
                            "Assert that the User instance returned is the same as the one sent in");
                        test.assertEqual(returnedUser.getEmail(), _this.testEmailUpdate,
                            "Assert that the User.email is set to the new value");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.retrieveUser(_this.testUser.getId(), function(throwable, returnedUser) {
                    if (!throwable) {
                        test.assertEqual(returnedUser.getEmail(), _this.testEmailUpdate,
                            "Assert that the User.email is set to the new value");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

function makeEmail() {
    var email = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ ) {
        email += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    email += "@email.com";
    return email;
}


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(userManagerCreateUserTest).with(
    test().name("UserManager - #createUser Test")
);

bugmeta.tag(userManagerDeleteUserTest).with(
    test().name("UserManager - #deleteUser Test")
);

bugmeta.tag(userManagerRetrieveUserTest).with(
    test().name("UserManager - #retrieveUser Test")
);

bugmeta.tag(userManagerUpdateUserTest).with(
    test().name("UserManager - #updateUser Test")
);
