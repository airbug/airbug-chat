var bugpackApi = require('bugpack');
bugpackApi.loadContext("", function(error, bugpack) {
    if (!error) {
        var SplashApplication = bugpack.require('splash.SplashApplication');
        SplashApplication.start();
    } else {
        console.log(error);
        //TODO BRN: Handle error
    }
});
