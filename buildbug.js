var BuildBug = require('buildbug');

BuildBug.enableModule('annotatejs');

BuildBug.addTask('build', function() {
    this.annotatejs.createNodeJsPackage({
        sourcePaths: [
            "./projects/airbugserver",
            "../bugjs/projects/bugjs"
        ],
        packageJson: {
            name: "airbugserver",
            version: "0.0.1",
            main: "./lib/AirBugServer.js"
        }
    });

    this.annotatejs.createClientJsPackage({
        sourcePaths: [
            "./projects/airbugclient"
        ],
        clientJson: {
            name: "airbugclient",
            version: "0.0.1"
        }
    });
});

BuildBug.defaultTask('build');