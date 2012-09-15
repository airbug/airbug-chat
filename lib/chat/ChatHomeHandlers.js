//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//TODO BRN: We have GOT to figure out a better way of referencing classes. This is crazy.

var annotate = require('../annotate/Annotate').annotate;


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var ChatHomeHandlers = {
    chatHomeHandler: annotate(function(request, response) {
        //TODO BRN: Replace this with a loaded html file
        var htmlContent = "<!DOCTYPE html>" +
            "<html>" +
                "<head>" +
                "</head>" +
                "<body>" +
                    //"<!-- TODO BRN: Add token support for swapping out the location of the javascript file between environments (local, production, qa, etc)-->" +
                    //"<script src=\"some token\" type=\"\"></script>" +
                    "<p>BOOYAH!</p>" +
                "</body>" +
            "</html>";

        response.write(htmlContent);
    }).with("@Handler('/')")
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ChatHomeHandlers;
