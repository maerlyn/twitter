/*jslint browser: true */
/*global io, $ */

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

    /*var socket = io('http://localhost:3000');
    socket.on("tweet.new", function (data) {
        console.log(data);
    });*/

    $(".container").on("click", "a.load-and-refresh-tweet", function (e) {
        var $panel = $(this).closest(".panel");
        e.preventDefault();

        $.post(
            $(this).attr("href"),
            function () {
                $.get(
                    $panel.data("show"),
                    function (data) {
                        var $newnode = $(data);
                        $panel.replaceWith($newnode);
                        $("abbr.timeago").timeago();
                    }
                );
            }
        );
    });
});
