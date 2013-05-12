var bugpackApi = require('bugpack');
bugpackApi.loadContext("", function(error, bugpack) {
    if (!error) {
        var AirBugApplication = bugpack.require('airbug.AirBugApplication');
        var application = new AirBugApplication();

        //TEST
        console.log("context loaded, starting application");

        application.start();
    } else {
        console.log(error);
        //TODO BRN: Handle error
    }
});
