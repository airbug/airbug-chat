//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.User')
//@Require('airbugserver.Github')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var User                    = bugpack.require('airbugserver.User');
var Github                  = bugpack.require('airbugserver.Github');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubBasicsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testUser = new User({

        });
        this.testUserId = '528ad6c3859c7f16a4000001';
        this.testGithubAuthCode = 'a1b75646f9ec91dee2dd4270f76e49ef2ebb9575';
        this.testGithubId = '12345';
        this.testGithubLogin = 'dicegame';
        this.testGithub = new Github({
            userId: this.testUserId,
            githubAuthCode: this.testGithubAuthCode,
            githubId: this.testGithubId,
            githubLogin: this.testGithubLogin
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testGithub.getGithubAuthCode(), this.testGithubAuthCode,
            'Assert Github.githubAuthCode was set correctly');
        test.assertEqual(this.testGithub.getGithubId(), this.testGithubId,
            'Assert Github.githubId was set correctly');
        test.assertEqual(this.testGithub.getGithubLogin(), this.testGithubLogin,
            'Assert Github.githubLogin was set correctly');
        test.assertEqual(this.testGithub.getUserId(), this.testUserId,
            'Assert Github.userId was set correctly');

        // Verify setters work
        this.testGithub.setGithubAuthCode('otherTestGithubAuthCode');
        test.assertEqual(this.testGithub.getGithubAuthCode(), 'otherTestGithubAuthCode',
            'Assert Github.setGithubAuthCode works correctly');
        this.testGithub.setGithubId('otherTestGithubId');
        test.assertEqual(this.testGithub.getGithubId(), 'otherTestGithubId',
            'Assert Github.setGithubId works correctly');
        this.testGithub.setGithubLogin('otherTestGithubLogin');
        test.assertEqual(this.testGithub.getGithubLogin(), 'otherTestGithubLogin',
            'Assert Github.setGithubLogin works correctly');
        this.testGithub.setUserId('otherTestUserId');
        test.assertEqual(this.testGithub.getUserId(), 'otherTestUserId',
            'Assert Github.setUserId works correctly');

        // Verify public methods for user
        this.testUser.setId('USERID');
        this.testGithub.setUser(this.testUser);
        test.assertEqual(this.testGithub.getUserId(), 'USERID',
            'Assert Github.setUser works correctly');
        test.assertTrue(!!this.testGithub.getUser());
    }
};
bugmeta.annotate(githubBasicsTest).with(
    test().name('Github - instantiation and getter/setter Test')
);
