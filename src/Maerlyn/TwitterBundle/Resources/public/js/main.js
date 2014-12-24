/*jslint browser: true*/
/*global  $*/

$(document).ready(function () {
    $("abbr.timeago").timeago();

    $(".panel-info").on("mouseover", function () {
        var $panel = $(this);

        $.post(
            $panel.data("markasread"),
            {},
            function () {
                $panel
                    .removeClass("panel-info")
                    .addClass("panel-default")
                    .off("mouseover");
            }
        );
    });

    var socket = io('http://localhost:3000');

    socket.on("tweet.new", function (data) {
        console.log(data);
    });
});
