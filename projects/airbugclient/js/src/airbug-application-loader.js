var bugpackApi = require('bugpack');
bugpackApi.loadContext(_appConfig.staticUrl, function(error, bugpack) {
    if (!error) {
        var Application                 = bugpack.require('bugapp.Application');
        var AirbugClientApplication     = bugpack.require('airbug.AirbugClientApplication');

        var application = new AirbugClientApplication();
        window.application = application;
        application.addEventListener(Application.EventTypes.STARTED, function(event) {
            console.log("Airbug client application successfully started");
        });
        application.addEventListener(Application.EventTypes.ERROR, function(event) {
            throw event.getData().error;
        });

        application.start();
    } else {
        throw error;
    }
});
