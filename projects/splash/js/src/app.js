//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('app')

//@Require('splash.BetaSignupApi')
//@Require('splash.FeedbackApi')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugFs =         bugpack.require('bugfs.BugFs');
var BetaSignUpApi = bugpack.require('splash.BetaSignUpApi');
var FeedbackApi =   bugpack.require('splash.FeedbackApi');


//-------------------------------------------------------------------------------
// Create Application
//-------------------------------------------------------------------------------

var configPath = path.resolve(__dirname, '../config.json');
var config = {
    port: 8000,
    mongoDbIp: "localhost"
};
if (BugFs.existsSync(configPath)) {
    config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
}

mongoose.connect('mongodb://' + config.mongoDbIp + '/airbug');

var app = express();

app.configure(function(){
    app.set('port', config.port);
    app.set('views', path.resolve(__dirname, '../resources/views'));
    app.set('view engine', 'jade');
    app.use(express.favicon(path.resolve(__dirname, '../static/img/airbug-icon.png')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride()); // put and delete support for html 4 and older
    app.use(express.static(path.resolve(__dirname, '../static')));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});


//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------

app.get('/', function(req, res){
    res.render('index', {
        title: 'airbug',
        production: config.production
    });
    res.end();
});
app.post('/api/beta-sign-up', function(req, res){
    for(var property in req.body){
        console.log(property + ' : ' + req.body[property]);
    }

    var betaSignUpData = req.body;

    BetaSignUpApi.createBetaSignUp(betaSignUpData, function(error, betaSignUp) {
        var result = {
            success: false
        };
        if (error){
            console.log(new Error('betaSignUp failed to save'));
            result.error = error.message;
        } else {
            console.log('betaSignUp saved successfully: ' + betaSignUp.toString());
            result.success = true;
        }
        res.send(JSON.stringify(result));
        res.end();
    });
});
app.post('/api/feedback', function(req, res) {
    for(var property in req.body){
        console.log(property + ' : ' + req.body[property]);
    }

    var feedbackData = req.body;

    FeedbackApi.createFeedback(feedbackData, function(error, feedback) {
        var result = {
            success: false
        };
        if (error){
            console.log(new Error('feedback failed to save'));
            result.error = error.message;
        } else {
            console.log('feedback saved successfully: ' + feedback.toString());
            result.success = true;
        }
        res.send(JSON.stringify(result));
        res.end();
    });
});
app.all('*', function(req, res){
  res.status(404);
  res.render('404', {
      title: 'airbug 404',
      production: config.production
  });
  res.end();
});

//-------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------

// Graceful Shutdown
process.on('SIGTERM', function () {
  console.log("Server Closing");
  app.close();
});

app.on('close', function () {
  console.log("Server Closed");
  db.connection.close();
});

// Create Server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


