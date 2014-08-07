/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.GithubLoginButtonView')

//@Require('Class')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ButtonView          = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonView}
     */
    var GithubLoginButtonView = Class.extend(ButtonView, {

        _name: "airbug.GithubLoginButtonView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template: '<a id="github-login-button-{{cid}}" class="btn-auth btn-github large" href="#">' +
                'Sign in with <b>Github</b>' +
            '</a>'
    });



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginButtonView", GithubLoginButtonView);
});
