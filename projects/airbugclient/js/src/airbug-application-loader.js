var bugpackApi = require('bugpack');
bugpackApi.loadContext("", function(error, bugpack) {
    if (!error) {
        var AirbugClientApplication = bugpack.require('airbug.AirbugClientApplication');
        var application = new AirbugClientApplication();

        //TEST
        console.log("context loaded, starting application");

        application.start(function(error) {
            if (error) {
                console.error(error);
            }
        });
    } else {
        throw error;
    }
});
