'use strict';

/**
 * Nuke - GET
 */
exports.get = function(req, res) {
    let action = '/feedback';
    let method = 'POST';
    let value_name = 'feedback_text';

    let html = '<html><body>\
            <form action="' + action + '" method="' + method + '" id="the-form">\
                <input type="text" name="' + value_name + '">\
                <input type="submit" value="Nuke it!">\
            </form>\
            <p id="response"></p>\
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>\
            <script>\
                $("#the-form").on("submit", function(e){\
                    var form = $(this);\
                    e.preventDefault;\
                    $.ajax({\
                        type: form.attr("method"),\
                        url: form.attr("action"),\
                        data: form.serialize()\
                    })\
                    .success(function(response){\
                        console.log(response);\
                    });\
                    return false;\
                });\
            </script>\
        </body></html>';

    res.send(html);
};
