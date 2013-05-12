//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('SplashApplication')
//@Autoload

//@Require('splitbug.SplitBug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var SplitBug   = bugpack.require('splitbug.SplitBug');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Update the objects in this file to use our class model from bugjs
var SplashApplication = {

    /**
     *
     */
    start: function() {
        SplitBug.configure({}, function(error) {
            if (error) {
                console.log(error);
            }
            if (Loader.appLoaded) {
                SplashApplication.initialize();
            } else {
                Loader.addLoadedListener(function() {
                    SplashApplication.initialize();
                });
            }
        });
    },

    /**
     *
     */
    initialize: function() {
        Tracker.trackAppLoad();
        initializeFeedbackPanel();
        if (firstPage === "explainerPage") {
            PageManager.goToPage(ExplainerPage);
        } else if (firstPage === "four04Page") {
            PageManager.goToPage(Four04Page);
        }
    }
};


var sendApiRequest = function(endpoint, dataObject, callback) {
    $.ajax({
        url: endpoint,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(dataObject),
        processData: false,
        type: "POST",
        error: function(jqXHR, textStatus, errorThrown) {
            var error = {
                jqXHR: jqXHR,
                textStatus: textStatus,
                errorThrown: errorThrown
            };
            callback(error);
        },
        success: function(data, textStatus, jqXHR) {
            var result = {
                data: data,
                textStatus: textStatus,
                jqXHR: jqXHR
            };
            callback(null, result);
        }
    });
};


// Tracking Code
//-------------------------------------------------------------------------------

var Tracker = {
    trackAppLoad: function() {
        Tracker.track("App", "Load");
    },
    trackGoalComplete: function(goalName) {
        Tracker.track("Goal", "Complete", goalName);
    },
    trackPageView: function(pageId) {
        Tracker.track("Page", "View", pageId);
    },
    track: function(category, action, label, value, nonInteraction) {
        if (_appConfig.production) {
            _gaq.push(['_trackEvent', category, action, label, nonInteraction]);
        } else {
            console.log("TackingEvent - category:" + category + " action:" + action +
                " label:" + label + " nonInteraction:" + nonInteraction);
        }
    }
};


// Feedback Panel
//-------------------------------------------------------------------------------

var feedbackPanelOpen = false;
var feedbackSubmitted = false;

var initializeFeedbackPanel = function() {
    var feedbackTab = $("#feedback-tab");
    var body = $('body');
    var feedbackContainer = $('#feedback-container');
    var feedbackEdgeContainer = $("#feedback-edge-container");
    var feedbackFormCancelButton = $("#feedback-form-cancel-button");
    var feedbackFormSubmitButton = $("#feedback-form-submit-button");

    feedbackTab.on("click", handleFeedbackTabClick);
    body.on("click", handleBodyClick);
    feedbackContainer.on("click", handleFeedbackContainerClick);
    feedbackEdgeContainer.on("click", handleFeedbackEdgeContainerClick);
    feedbackFormCancelButton.on("click", handleFeedbackFormCancelButtonClick);
    feedbackFormSubmitButton.on("click", handleFeedbackFormSubmitButtonClick);
};

var handleFeedbackTabClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    } else {
        openFeedbackPanel();
    }
    event.stopPropagation();
};

var openFeedbackPanel = function() {
    if (!feedbackPanelOpen) {
        feedbackPanelOpen = true;
        var interferenceContainer = $("#interference-container");
        interferenceContainer.css("width", "100%");
        interferenceContainer.css("height", "100%");
        animateFeedbackPanelOpen();
   }
};

var animateFeedbackPanelOpen = function() {

    //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
    // transitions, otherwise use jquery to animate.

    var pageContainer = $("#page-container");
    pageContainer.removeClass("page-container-fadein");
    pageContainer.addClass("page-container-fadeout");
    var feedbackContainer = $("#feedback-container");
    feedbackContainer.removeClass("feedback-container-collapse");
    feedbackContainer.addClass("feedback-container-expand");
    var feedbackAirbugPull1 = $("#feedback-airbug-pull-1");
    feedbackAirbugPull1.removeClass("feedback-airbug-show");
    feedbackAirbugPull1.removeClass("feedback-airbug-show-after-collapse");
    feedbackAirbugPull1.addClass("feedback-airbug-hide");
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-collapse");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-expand");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-hide");
    feedbackAirbugPull3.addClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.addClass("feedback-airbug-show");
    var feedbackAirbugThankyou = $("#feedback-airbug-thankyou");
    feedbackAirbugThankyou.removeClass("feedback-airbug-show");
    feedbackAirbugThankyou.removeClass("feedback-airbug-show-after-collapse");
    feedbackAirbugThankyou.addClass("feedback-airbug-hide");
};

var closeFeedbackPanel = function() {
    if (feedbackPanelOpen) {
        feedbackPanelOpen = false;
        var interferenceContainer = $("#interference-container");
        interferenceContainer.css("width", "");
        interferenceContainer.css("height", "");
        animateFeedbackPanelClose();
    }
};

var animateFeedbackPanelClose = function() {

    //TODO BRN: Add some sort of check here for supported css transitions. If they're supported, then use css
    // transitions, otherwise use jquery to animate.

    var pageContainer = $('#page-container');
    pageContainer.removeClass('page-container-fadeout');
    pageContainer.addClass('page-container-fadein');
    var feedbackContainer = $('#feedback-container');
    feedbackContainer.removeClass('feedback-container-expand');
    feedbackContainer.addClass('feedback-container-collapse');
    var feedbackAirbugPull1 = $("#feedback-airbug-pull-1");
    var feedbackAirbugThankyou = $("#feedback-airbug-thankyou");
    if (feedbackSubmitted) {
        feedbackAirbugPull1.addClass("feedback-airbug-hide");
        feedbackAirbugPull1.removeClass("feedback-airbug-show");
        feedbackAirbugThankyou.removeClass("feedback-airbug-hide");
        feedbackAirbugThankyou.addClass("feedback-airbug-show");
        feedbackAirbugThankyou.addClass("feedback-airbug-show-after-collapse");
    } else {
        feedbackAirbugPull1.removeClass("feedback-airbug-hide");
        feedbackAirbugPull1.addClass("feedback-airbug-show");
        feedbackAirbugPull1.addClass("feedback-airbug-show-after-collapse");
    }
    var feedbackAirbugPull2 = $("#feedback-airbug-pull-2");
    feedbackAirbugPull2.removeClass("feedback-airbug-pull-2-expand");
    feedbackAirbugPull2.addClass("feedback-airbug-pull-2-collapse");
    var feedbackAirbugPull3 = $("#feedback-airbug-pull-3");
    feedbackAirbugPull3.removeClass("feedback-airbug-pull-3-expand");
    feedbackAirbugPull3.removeClass("feedback-airbug-show");
    feedbackAirbugPull3.addClass("feedback-airbug-hide");
};

var handleBodyClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    }
};

var handleFeedbackContainerClick = function(event) {
    event.stopPropagation();
};

var handleFeedbackEdgeContainerClick = function(event) {
    if (feedbackPanelOpen) {
        closeFeedbackPanel();
    } else {
        openFeedbackPanel();
    }
};

var handleFeedbackFormCancelButtonClick = function(event) {
    event.preventDefault();
    closeFeedbackPanel();
    return false;
};

var handleFeedbackFormSubmitButtonClick = function(event) {
    event.preventDefault();

    var feedbackFormData = getFeedbackFormData();
    validateFeedbackForm(feedbackFormData, function(error) {
        if (!error) {
            submitFeedbackForm(feedbackFormData);
            closeFeedbackPanel();
        } else {
            showFeedbackFormError(error);
        }
    });
    return false;
};

var getFeedbackFormData = function() {
    var formDataArray = $('#feedback-form').serializeArray();
    var feedbackData = {};

    formDataArray.forEach(function(formEntry) {
        feedbackData[formEntry.name] = formEntry.value;
    });

    feedbackData.currentPage = PageManager.currentPage.pageName;
    return feedbackData;
};

var showFeedbackFormError = function(error) {

};

var submitFeedbackForm = function(feedbackFormData) {
    Tracker.trackGoalComplete("FeedbackSubmitted");
    sendApiRequest("/api/feedback", feedbackFormData, function(error, result) {
        //TODO BRN: Handle errors
    });
    feedbackSubmitted = true;
};

var validateFeedbackForm = function(feedbackFormData, callback) {
    //TODO BRN: Validate the feedback form data
    callback();
};


var PageManager = {
    currentPage: null,
    goToPage: function(page) {
        if (page) {
            page.initialize();
            page.activate();
            PageManager.currentPage = page;
            Tracker.trackPageView(page.pageName);
        }
    }
};


// Explainer page
//-------------------------------------------------------------------------------

var ExplainerPage = {
    pageName: "explainerPage",
    initialize: function() {

        var marketingTaglineHeader = $("#marketing-tagline-header");
        SplitBug.splitTest({
            name: "alternate-tag-line",
            controlFunction: function() {
                marketingTaglineHeader.html("Unite and motivate your team's cross-platform collaboration");
            },
            testFunction: function() {
                marketingTaglineHeader.html("Collaborative chat for developers");
            }
        });

        var betaSignUpButton = $("#beta-sign-up-button");
        betaSignUpButton.on("click", function(event) {
            PageManager.goToPage(BetaSignUpPage);
        });

    },
    activate: function() {
        var explainerPage = $("#explainer-page");
        var loadingPage = $("#loading-page");
        loadingPage.hide();
        explainerPage.removeClass("page-slide-show");
        explainerPage.removeClass("page-slide-hide");
        explainerPage.show();
    }
};

// 404 page
//-------------------------------------------------------------------------------

var Four04Page = {
    pageName: "four04Page",
    initialize: function() {
    },
    activate: function() {
        var four04Page = $("#four04-page");
        var loadingPage = $("#loading-page");
        loadingPage.hide();
        four04Page.show();
    }
};


// Beta SignUp Page
//-------------------------------------------------------------------------------

var BetaSignUpPage = {
    pageName: "betaSignUpPage",
    initialize: function() {
        airbugs.forEach(function(airbug) {
            airbug.setup();
        });
        DragManager.registerDragTarget(AirbugJar);
        BetaSignUpModal.initialize();
        $('a#home').on('click', function(event){
            var explainerPage = $("#explainer-page");
            var betaSignUpPage = $("#beta-sign-up-page");
            betaSignUpPage.removeClass("page-slide-show");
            betaSignUpPage.addClass("page-slide-hide");
            PageManager.goToPage(ExplainerPage);
            explainerPage.addClass("page-slide-show");
        });
    },
    activate: function() {
        var explainerPage = $("#explainer-page");
        var betaSignUpPage = $("#beta-sign-up-page");
        explainerPage.addClass("page-slide-hide");
        betaSignUpPage.removeClass("page-slide-show");
        betaSignUpPage.removeClass("page-slide-hide");
        betaSignUpPage.show();
        betaSignUpPage.addClass("page-slide-show");
    }
};

var AirBug = function(name, element) {
    this.name = name;
    this.element = element;
};
AirBug.prototype = {
    setup: function() {
        DragManager.registerDraggableObject(this);
    },
    initializeDraggableObject: function() {
        var _this = this;
        var element = this.element;
        element.on("touchstart mousedown", function(event) {
            _this.handleInteractionStart(event);
        });
        element.addClass("grab");
    },
    handleInteractionStart: function(event) {
        event.preventDefault();
        DragManager.startDrag(this, event.clientX, event.clientY);
    },
    startDrag: function() {
        AirbugJar.removeAirbug(this);
        var element = this.element;
        //NOTE BRN: There seems to be a bug here where the cursor is not changed immediately when the mouse is down
        //https://bugs.webkit.org/show_bug.cgi?id=53341

        element.removeClass("grab");
        element.removeClass("drag-released");
        element.addClass("grabbing");
    },
    releaseDrag: function() {
        var element = this.element;
        element.css("left", "");
        element.css("top", "");
        element.addClass("drag-released");
        element.addClass("grab");
        element.removeClass("grabbing");
    }
};

var otherAirBug = new AirBug("other", $("#airbug-other-container"));

var airbugs = [
    new AirBug("basecamp", $("#airbug-basecamp-container")),
    new AirBug("bitbucket", $("#airbug-bitbucket-container")),
    new AirBug("github", $("#airbug-github-container")),
    new AirBug("jira", $("#airbug-jira-container")),
    otherAirBug,
    new AirBug("pivotaltracker", $("#airbug-pivotaltracker-container")),
    new AirBug("salesforce", $("#airbug-salesforce-container")),
    new AirBug("uservoice", $("#airbug-uservoice-container")),
    new AirBug("zendesk", $("#airbug-zendesk-container"))
];

var AirbugJar = {
    element: $("#airbug-jar-container"),
    containedAirbugs: [],
    previouslyContainedAirbugs: [],
    getAirbugNames: function() {
        var names = [];
        AirbugJar.containedAirbugs.forEach(function(airbug) {
            names.push(airbug.name);
        });
        return names;
    },
    getCount: function() {
        return AirbugJar.containedAirbugs.length;
    },
    indexOf: function(airbug) {
        for (var i = 0, size = AirbugJar.containedAirbugs.length; i < size; i++) {
            var airbugAt = AirbugJar.containedAirbugs[i];
            if (airbugAt.name === airbug.name) {
                return i;
            }
        }
    },
    addAirbug: function(airbug) {
        AirbugJar.containedAirbugs.push(airbug);
        AirbugJar.renderAirbugs();
        if (AirbugJar.getCount() >= 3 ) {
            if(airbug === otherAirBug){
                $("#other-airbug-form-submit-button").off('click', OtherAirBugForm.handleSubmitButtonClick);
                $("#other-airbug-form-cancel-button").off('click', OtherAirBugForm.handleCancelButtonClick);
                $("#other-airbug-form-submit-button").on('click', OtherAirBugForm.handleFinalBugSubmitButtonClick);
                $("#other-airbug-form-cancel-button").on('click', OtherAirBugForm.handleFinalBugCancelButtonClick);
            } else {
                setTimeout(function() {
                    BetaSignUpModal.show();
                    // Make airbugs ungrabbable
                }, 1200)
            }
        }
    },
    removeAirbug: function(airbug) {
        var index = AirbugJar.indexOf(airbug);
        if (index > -1) {
            AirbugJar.containedAirbugs.splice(index, 1);
            AirbugJar.renderAirbugs();
        }
    },
    renderAirbugs: function() {
        DragManager.clearProxies();
        for (var i = 0, size = AirbugJar.containedAirbugs.length; i < size; i++) {
            var airbug = AirbugJar.containedAirbugs[i];
            var element = airbug.element;
            if (i === 0) {
                DragManager.createDragProxy("hotspot1", $("#airbug-jar-hotspot-1"), airbug);
                element.css("left", "245px");
                element.css("top", "340px");
            } else if (i === 1) {
                DragManager.createDragProxy("hotspot2", $("#airbug-jar-hotspot-2"), airbug);
                element.css("left", "355px");
                element.css("top", "460px");
            } else {
                DragManager.createDragProxy("hotspot3", $("#airbug-jar-hotspot-3"), airbug);
                element.css("left", "235px");
                element.css("top", "540px");
            }
        }
    },
    startDrag: function() {
        var targetElement = AirbugJar.element;
        targetElement.on("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.addClass("grabbing");
    },
    releaseDrag: function() {
        var targetElement = AirbugJar.element;
        targetElement.off("touchend mouseup", AirbugJar.handleDragReleaseOnTarget);
        targetElement.removeClass("grabbing");
    },
    handleDragReleaseOnTarget: function(event) {
        if (AirbugJar.getCount() < 3) {
            var instructionsContainer = $("#instructions-container");
            instructionsContainer.addClass("hide-instructions");
            event.stopPropagation();
            var draggingObject = DragManager.draggingObject;
            DragManager.releaseDrag();
            AirbugJar.addAirbug(draggingObject);
            if (draggingObject === otherAirBug) {
                OtherAirBugForm.show();
            }
        }
    },
    handleRemovalOfFinalBug: function(event) {
        if (AirbugJar.getCount() < 3) {
            ContinueSignUpButton.hide();
            Arrow.show();
            AirbugJar.previouslyContainedAirbugs.forEach(function(airbug){
               airbug.element.off("touchend mouseup", AirbugJar.handleRemovalOfFinalBug);
            });
            AirbugJar.previouslyContainedAirbugs = [];
        }
    }
};

var OtherAirBugForm = {
    element: $('#other-airbug-form-container'),
    show: function(){
        $("#other-airbug-form-submit-button").on('click', OtherAirBugForm.handleSubmitButtonClick);
        $("#other-airbug-form-cancel-button").on('click', OtherAirBugForm.handleCancelButtonClick);
        $('#other-airbug-form-container input').keyup(function(e) {
            if(e.keyCode == 13) {
                OtherAirBugForm.handleSubmitButtonClick(e);
            } else {
                var inputValue = $('#other-airbug-form-container input').val();
                $('#other-airbug-faux-form input').attr('placeholder', inputValue);
            }
        });
        OtherAirBugForm.element.show()
    },
    hide: function(){OtherAirBugForm.element.hide()},
    handleSubmitButtonClick: function(event){
        var otherAirbug = otherAirbug;
        var inputValue = $('#other-airbug-form-container input').val();
        if(inputValue !== ''){
            otherAirBug.name += ': ' + inputValue;
            OtherAirBugForm.hide();
        } else {
            OtherAirBugForm.hide();
        }
    },
    handleCancelButtonClick: function(event){
        OtherAirBugForm.hide();
    },
    handleFinalBugSubmitButtonClick: function(event){
        OtherAirBugForm.handleSubmitButtonClick();
        setTimeout(function() {
            BetaSignUpModal.show();
            // Make airbugs ungrabbable
        }, 1200)
        $("#other-airbug-form-submit-button").off('click', OtherAirBugForm.handleFinalBugSubmitButtonClick);
        $("#other-airbug-form-cancel-button").off('click', OtherAirBugForm.handleFinalBugCancelButtonClick);
    },
    handleFinalBugCancelButtonClick: function(event){
        OtherAirBugForm.handleCancelButtonClick();
        setTimeout(function() {
            BetaSignUpModal.show();
            // Make airbugs ungrabbable
        }, 1200)
        $("#other-airbug-form-submit-button").off('click', OtherAirBugForm.handleFinalBugSubmitButtonClick);
        $("#other-airbug-form-cancel-button").off('click', OtherAirBugForm.handleFinalBugCancelButtonClick);
    }
};

var Arrow = {
    element: $(".arrow-container"),
    activate: function(){
        Arrow.element.on('click', function(){
            BetaSignUpModal.element.modal('show');
            Arrow.element.css("cursor", "pointer");
        });
    },
    hide: function(){
        Arrow.element.hide();
    },
    show: function(){
        Arrow.element.show();
    }
};

var ContinueSignUpButton = {
    element: $("#continue-sign-up-button-container"),
    show: function(){
        ContinueSignUpButton.element.show();
    },
    hide: function(){
        ContinueSignUpButton.element.hide();
    }
};

var BetaSignUpModal = {
    element: $("#beta-sign-up-modal"),
    initialize: function() {
        if (!BetaSignUpModal.initialized) {
            BetaSignUpModal.initialized = true;
            var betaSignUpSubmitButton = $("#beta-sign-up-form-submit-button");
            var betaSignUpCancelButton = $("#beta-sign-up-form-cancel-button");
            var betaSignUpCloseButton  = $(".modal-header .close");
            betaSignUpSubmitButton.on("click", BetaSignUpModal.handleSubmitButtonClick);
            betaSignUpCancelButton.on("click", BetaSignUpModal.handleCancelButtonClick);
            betaSignUpCloseButton.on("click", BetaSignUpModal.handleCancelButtonClick);
            ContinueSignUpButton.element.on("click", function(){
                BetaSignUpModal.element.modal('show');
            });
        }
    },
    show: function() {
        BetaSignUpModal.element.modal('show');
        Arrow.hide();
        ContinueSignUpButton.show();
    },
    hide: function() {
        BetaSignUpModal.element.modal('hide');
    },

    getFormData: function() {
        var formDataArray = $('#beta-sign-up-form').serializeArray();
        var betaSignUpData = {};
        formDataArray.forEach(function(formEntry) {
            betaSignUpData[formEntry.name] = formEntry.value;
        });
        betaSignUpData.wishList = AirbugJar.getAirbugNames();
        return betaSignUpData;
    },

    submitForm: function(formData) {
        Tracker.trackGoalComplete("SignedUpForBeta");
        sendApiRequest("/api/beta-sign-up", formData, function(error, result) {
            //TODO BRN: Handle errors
        });
    },

    validateForm: function(formData, callback) {
        var formDataArray = $('#beta-sign-up-form').serializeArray();
        var error = null;
        formDataArray.forEach(function(formEntry){
            var name = formEntry.name;
            var value = formEntry.value;
            if((name === 'name' && value === '') || (name === 'email' && value === '')){
                $('#' + name + '+.validation').addClass("invalid");
                error = new Error("Required fields have not been filled in");
            }
        });
        callback(error);
    },

    showFormError: function(error) {

    },

    handleCancelButtonClick: function(event) {
        event.preventDefault();
        BetaSignUpModal.hide();
        var currentlyContainedAirbugs = AirbugJar.containedAirbugs;
        AirbugJar.previouslyContainedAirbugs = currentlyContainedAirbugs;
        currentlyContainedAirbugs.forEach(function(airbug){
           airbug.element.on("touchend mouseup", AirbugJar.handleRemovalOfFinalBug);
        });
        $('#name+.validation').removeClass("invalid");
        $('#email+.validation').removeClass("invalid");
        return false;
    },
    handleSubmitButtonClick: function(event) {
        event.preventDefault();
        var formData = BetaSignUpModal.getFormData();
        $('#name+.validation').removeClass("invalid");
        $('#email+.validation').removeClass("invalid");
        BetaSignUpModal.validateForm(formData, function(error) {
            if (!error) {
                BetaSignUpModal.submitForm(formData);
                BetaSignUpModal.hide();
                PageManager.goToPage(ThankYouPage);
            } else {
                BetaSignUpModal.showFormError(error);
            }
        });
        return false;
    }
};


// Drag Manager
//-------------------------------------------------------------------------------

var DragProxy = function(name, element, draggableObject) {
    this.name = name;
    this.element = element;
    this.draggableObject = draggableObject;
};
DragProxy.prototype = {
    setup: function() {
        DragManager.registerDraggableObject(this);
    },
    initializeDragProxy: function() {
        var _this = this;
        this._handle = function(event) {
            _this.handleInteractionStart(event);
        };
        this.element.on("touchstart mousedown", this._handle);
        this.element.addClass("grab");
    },
    uninitializeDragProxy: function() {
        this.element.off("touchstart mousedown", this._handle);
        this.element.removeClass("grab");
        this.element.removeClass("grabbing");
    },
    startDrag: function() {
        this.element.addClass("grabbing");
        this.element.removeClass("grab");
    },
    releaseDrag: function() {
        this.element.addClass("grab");
        this.element.removeClass("grabbing");
    },
    handleInteractionStart: function(event) {
        event.preventDefault();
        DragManager.startDrag(this.draggableObject, event.clientX, event.clientY);
    }
};

var DragManager = {
    draggingObject: null,
    boundingOffsets: null,
    dragStartOffsets: null,
    draggableObjects: [],
    dragTargets: [],
    dragProxies: [],

    createDragProxy: function(name, element, draggableObject) {
        var dragProxy = new DragProxy(name, element, draggableObject);
        DragManager.registerDragProxy(dragProxy);
    },
    registerDraggableObject: function(draggableObject) {
        DragManager.draggableObjects.push(draggableObject);
        draggableObject.initializeDraggableObject();
    },
    registerDragTarget: function(dragTarget) {
        DragManager.dragTargets.push(dragTarget);
    },
    registerDragProxy: function(dragProxy) {
        DragManager.dragProxies.push(dragProxy);
        dragProxy.initializeDragProxy();
    },
    startDrag: function(draggableObject, startX, startY) {
        DragManager.draggingObject = draggableObject;
        var draggableElement = draggableObject.element;
        var draggingElementOffsets = draggableElement.offset();
        DragManager.dragStartOffsets = {
            left: startX - draggingElementOffsets.left,
            top: startY - draggingElementOffsets.top
        };
        DragManager.boundingOffsets = draggableElement.parent().offset();
        var body = $('body');
        body.on("touchmove mousemove", DragManager.handleDragMove);
        body.on("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.startDrag();
        });
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.startDrag();
        });
        draggableObject.startDrag();
    },
    moveDrag: function(clientX, clientY) {
        var x = clientX - DragManager.boundingOffsets.left - DragManager.dragStartOffsets.left;
        var y = clientY - DragManager.boundingOffsets.top - DragManager.dragStartOffsets.top;
        var element = DragManager.draggingObject.element;
        element.css("left", x + "px");
        element.css("top", y + "px");
    },
    releaseDrag: function() {
        var body = $('body');
        body.off("touchmove mousemove", DragManager.handleDragMove);
        body.off("touchend mouseup", DragManager.handleDragRelease);

        DragManager.dragTargets.forEach(function(dragTarget) {
            dragTarget.releaseDrag();
        });
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.releaseDrag();
        });

        DragManager.draggingObject.releaseDrag();

        DragManager.dragStartOffsets = null;
        DragManager.draggingObject = null;
        DragManager.boundingOffsets = null;
    },
    clearProxies: function() {
        DragManager.dragProxies.forEach(function(dragProxy) {
            dragProxy.uninitializeDragProxy();
        });
        DragManager.dragProxies = [];
    },
    indexOf: function(dragProxy) {
        for (var i = 0, size = DragManager.dragProxies.length; i < size; i++) {
            var dragProxyAt = DragManager.dragProxies[i];
            if (dragProxyAt.name === dragProxy.name) {
                return i;
            }
        }
    },
    removeProxy: function(dragProxy) {
        var index = DragManager.indexOf(dragProxy);
        if (index > -1) {
            DragManager.dragProxies.splice(index, 1);
            dragProxy.uninitializeDragProxy();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    handleDragMove: function(event) {
        DragManager.moveDrag(event.clientX, event.clientY);
    },

    handleDragRelease: function(event) {
        DragManager.releaseDrag();
    }
};


// Thank You Page
//-------------------------------------------------------------------------------

var ThankYouPage = {
    pageName: "thankYouPage",
    initialize: function() {

    },
    activate: function() {
        var betaSignUpPage = $("#beta-sign-up-page");
        var thankYouPage = $("#thank-you-page");
        betaSignUpPage.addClass("page-slide-hide");
        thankYouPage.show();
        thankYouPage.addClass("page-slide-show");
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.SplashApplication', SplashApplication);
