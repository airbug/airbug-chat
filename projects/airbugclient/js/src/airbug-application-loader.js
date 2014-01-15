var bugpackApi = require('bugpack');
bugpackApi.loadContext(_appConfig.staticUrl, function(error, bugpack) {
    if (!error) {
        var AirbugClientApplication = bugpack.require('airbug.AirbugClientApplication');
        var application = new AirbugClientApplication();
        application.start(function(error) {
            if (error) {
                console.error(error);
            }
        });
    } else {
        throw error;
    }
});
