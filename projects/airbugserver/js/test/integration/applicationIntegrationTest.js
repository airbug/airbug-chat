/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


// usage:
//      start airbug server
//      npm install phantomjs
//      phantomjs applicationIntegrationTest.js
//      open homeScreen.png

console.log("Starting Airbug PhantomJS Automation Tests");
function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log(" arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}
var page = require('webpage').create();

page.onInitialized = function() {
    console.log("page.onInitialized");
    printArgs.apply(this, arguments);
};
page.onLoadStarted = function() {
    console.log("page.onLoadStarted");
    printArgs.apply(this, arguments);
};
page.onLoadFinished = function() {
    console.log("page.onLoadFinished");
    printArgs.apply(this, arguments);
};
page.onUrlChanged = function() {
    console.log("page.onUrlChanged");
    printArgs.apply(this, arguments);
};
page.onNavigationRequested = function() {
    console.log("page.onNavigationRequested");
    printArgs.apply(this, arguments);
};
// window.console.log(msg);
page.onConsoleMessage = function() {
    console.log("page.onConsoleMessage");
    printArgs.apply(this, arguments);
};

// window.alert(msg);
page.onAlert = function() {
    console.log("page.onAlert");
    printArgs.apply(this, arguments);
};
page.open("http://localhost:8000/", function(status) {
    console.log("status == ", status);
    var title = page.evaluate(function() {
        return document.title;
    });
    console.log("page title == ", title);
    // super ghetto way of waiting for the page to finish loading.
    // We really should be looking for the presence of page elements.
    setTimeout(function() {
        page.render('homeScreen.png');
        page.open("http://localhost:8000/#login", function(status) {
            console.log(status);
        });
        setTimeout(function() {
            phantom.exit();
        }, 5000);
    }, 5000);
});
